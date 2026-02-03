#!/usr/bin/env python3
"""
Supabase OAuth Code Exchange Script

This script exchanges an OAuth authorization code for a full session object
containing access_token, refresh_token, and other session data.

Usage:
    python exchange_code.py <auth_code>

Example:
    python exchange_code.py abc123def456...
"""

import os
import sys
import json
import requests
from pathlib import Path
from typing import Dict, Any, Optional


# Supabase configuration
SUPABASE_URL = "https://cvzmvsnztqtehoquirft.supabase.co"
TOKEN_ENDPOINT = f"{SUPABASE_URL}/auth/v1/token"
SESSION_FILE = Path.home() / ".config" / "clawdmetrics" / "session.json"


def get_supabase_anon_key() -> str:
    """
    Retrieve the Supabase anonymous key from environment variable.
    
    Returns:
        str: The Supabase anon key
        
    Raises:
        SystemExit: If the environment variable is not set
    """
    anon_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not anon_key:
        print("❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.")
        print("   Please set it before running this script:")
        print("   export NEXT_PUBLIC_SUPABASE_ANON_KEY='your_key_here'")
        sys.exit(1)
    
    return anon_key


def exchange_code_for_session(auth_code: str, anon_key: str) -> Dict[str, Any]:
    """
    Exchange the OAuth authorization code for a session object.
    
    Args:
        auth_code: The authorization code obtained from OAuth redirect
        anon_key: The Supabase anonymous key
        
    Returns:
        dict: The session object containing access_token, refresh_token, etc.
        
    Raises:
        SystemExit: If the request fails
    """
    headers = {
        "Content-Type": "application/json",
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
    }
    
    # TODO: Implement proper PKCE code_verifier generation and storage
    # For now, using a placeholder. In a production implementation, you would:
    # 1. Generate code_verifier during initial OAuth flow
    # 2. Store it securely (e.g., in session storage or encrypted file)
    # 3. Retrieve it here to complete the PKCE flow
    code_verifier = "placeholder_code_verifier_needs_proper_implementation"
    
    payload = {
        "grant_type": "pkce",
        "code": auth_code,
        "code_verifier": code_verifier,
    }
    
    print(f"🔄 Exchanging authorization code for session...")
    print(f"   Endpoint: {TOKEN_ENDPOINT}")
    print(f"   Code: {auth_code[:20]}...")
    
    try:
        response = requests.post(
            TOKEN_ENDPOINT,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # Check if request was successful
        if response.status_code == 200:
            session_data = response.json()
            print(f"✅ Successfully exchanged code for session!")
            return session_data
        else:
            error_msg = f"HTTP {response.status_code}"
            try:
                error_data = response.json()
                if "error_description" in error_data:
                    error_msg += f": {error_data['error_description']}"
                elif "error" in error_data:
                    error_msg += f": {error_data['error']}"
            except:
                error_msg += f": {response.text[:200]}"
            
            print(f"❌ Error exchanging code: {error_msg}")
            sys.exit(1)
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {str(e)}")
        sys.exit(1)


def save_session_to_file(session_data: Dict[str, Any]) -> None:
    """
    Save the session object to a JSON file.
    
    Args:
        session_data: The session object to save
    """
    # Create directory if it doesn't exist
    session_file_dir = SESSION_FILE.parent
    session_file_dir.mkdir(parents=True, exist_ok=True)
    
    # Save session data to file
    try:
        with open(SESSION_FILE, 'w') as f:
            json.dump(session_data, f, indent=2)
        
        print(f"💾 Session saved to: {SESSION_FILE}")
        print(f"   File size: {SESSION_FILE.stat().st_size} bytes")
        
    except IOError as e:
        print(f"❌ Error saving session file: {str(e)}")
        sys.exit(1)


def print_session_summary(session_data: Dict[str, Any]) -> None:
    """
    Print a summary of the session data.
    
    Args:
        session_data: The session object
    """
    print("\n📋 Session Summary:")
    print("   " + "-" * 50)
    
    # Print key session fields
    if "access_token" in session_data:
        token_preview = session_data["access_token"][:30] + "..."
        print(f"   Access Token: {token_preview}")
    
    if "refresh_token" in session_data:
        refresh_preview = session_data["refresh_token"][:30] + "..."
        print(f"   Refresh Token: {refresh_preview}")
    
    if "expires_in" in session_data:
        print(f"   Expires In: {session_data['expires_in']} seconds")
    
    if "token_type" in session_data:
        print(f"   Token Type: {session_data['token_type']}")
    
    if "user" in session_data:
        user = session_data["user"]
        if isinstance(user, dict):
            email = user.get("email", "N/A")
            user_id = user.get("id", "N/A")
            print(f"   User Email: {email}")
            print(f"   User ID: {user_id}")
    
    print("   " + "-" * 50)


def main():
    """
    Main function to handle command-line execution.
    """
    # Check if auth_code argument is provided
    if len(sys.argv) < 2:
        print("❌ Error: Missing required argument 'auth_code'")
        print("\nUsage:")
        print(f"  python {sys.argv[0]} <auth_code>")
        print("\nExample:")
        print(f"  python {sys.argv[0]} abc123def456...")
        sys.exit(1)
    
    auth_code = sys.argv[1].strip()
    
    if not auth_code:
        print("❌ Error: auth_code cannot be empty")
        sys.exit(1)
    
    print("🚀 Supabase OAuth Code Exchange")
    print("=" * 60)
    
    # Get Supabase anon key from environment
    anon_key = get_supabase_anon_key()
    
    # Exchange code for session
    session_data = exchange_code_for_session(auth_code, anon_key)
    
    # Save session to file
    save_session_to_file(session_data)
    
    # Print session summary
    print_session_summary(session_data)
    
    print("\n✅ Done! Session has been saved and is ready to use.")


if __name__ == "__main__":
    main()
