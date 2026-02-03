#!/usr/bin/env python3
"""
Supabase Stats Reporting Script

This script reports daily statistics (interaction count, input tokens, output tokens)
to Supabase by calling an RPC function that handles upsert logic.

Usage:
    python report_stats.py <interaction_count> <input_tokens> <output_tokens>

Example:
    python report_stats.py 10 5000 3000
"""

import os
import sys
import json
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional


# Configuration
SUPABASE_URL = "https://cvzmvsnztqtehoquirft.supabase.co"
RPC_ENDPOINT = f"{SUPABASE_URL}/rest/v1/rpc/upsert_daily_stats"
SESSION_FILE = Path.home() / ".config" / "clawdmetrics" / "session.json"


def load_session() -> Dict[str, Any]:
    """
    Load user session from session.json file.
    
    Returns:
        dict: Session data containing access_token and user info
        
    Raises:
        SystemExit: If session file doesn't exist or is invalid
    """
    if not SESSION_FILE.exists():
        print("❌ Error: Session file not found.")
        print(f"   Expected location: {SESSION_FILE}")
        print("   Please run exchange_code.py first to create a session.")
        sys.exit(1)
    
    try:
        with open(SESSION_FILE, 'r') as f:
            session_data = json.load(f)
        
        if not isinstance(session_data, dict):
            raise ValueError("Session file must contain a JSON object")
        
        return session_data
        
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in session file: {str(e)}")
        sys.exit(1)
    except IOError as e:
        print(f"❌ Error: Cannot read session file: {str(e)}")
        sys.exit(1)


def get_access_token(session_data: Dict[str, Any]) -> str:
    """
    Extract access_token from session data.
    
    Args:
        session_data: Session dictionary
        
    Returns:
        str: Access token
        
    Raises:
        SystemExit: If access_token is not found
    """
    access_token = session_data.get('access_token')
    
    if not access_token:
        print("❌ Error: access_token not found in session file.")
        print("   The session may be expired or invalid.")
        print("   Please run exchange_code.py again to refresh the session.")
        sys.exit(1)
    
    return access_token


def get_user_id(session_data: Dict[str, Any]) -> Optional[str]:
    """
    Extract user ID from session data.
    
    Args:
        session_data: Session dictionary
        
    Returns:
        str or None: User ID if found
    """
    if 'user' in session_data and isinstance(session_data['user'], dict):
        return session_data['user'].get('id')
    return None


def get_service_role_key() -> str:
    """
    Get Supabase service role key from environment variable.
    
    Returns:
        str: Service role key
        
    Raises:
        SystemExit: If environment variable is not set
    """
    service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not service_key:
        print("❌ Error: SUPABASE_SERVICE_KEY environment variable is not set.")
        print("   Please set it before running this script:")
        print("   export SUPABASE_SERVICE_KEY='your_service_role_key_here'")
        sys.exit(1)
    
    return service_key


def report_stats(
    interaction_count: int,
    input_tokens: int,
    output_tokens: int,
    access_token: str,
    service_key: str,
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Report statistics to Supabase by calling the upsert_daily_stats RPC function.
    
    Args:
        interaction_count: Number of interactions
        input_tokens: Number of input tokens
        output_tokens: Number of output tokens
        access_token: User's access token (for identifying user)
        service_key: Supabase service role key (for authentication)
        user_id: Optional user ID from session
        
    Returns:
        dict: Response from Supabase
        
    Raises:
        SystemExit: If the request fails
    """
    headers = {
        "Content-Type": "application/json",
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        # Include user's access token in a custom header for user identification
        "X-User-Token": access_token,
    }
    
    # Prepare payload for RPC function
    payload = {
        "interaction_count": interaction_count,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
    }
    
    # Add user_id if available
    if user_id:
        payload["user_id"] = user_id
    
    print(f"📊 Reporting stats to Supabase...")
    print(f"   Endpoint: {RPC_ENDPOINT}")
    print(f"   Interaction Count: {interaction_count}")
    print(f"   Input Tokens: {input_tokens}")
    print(f"   Output Tokens: {output_tokens}")
    if user_id:
        print(f"   User ID: {user_id}")
    
    try:
        response = requests.post(
            RPC_ENDPOINT,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # Check if request was successful
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Successfully reported stats!")
            return result
        else:
            error_msg = f"HTTP {response.status_code}"
            try:
                error_data = response.json()
                if "message" in error_data:
                    error_msg += f": {error_data['message']}"
                elif "error" in error_data:
                    error_msg += f": {error_data['error']}"
                elif "hint" in error_data:
                    error_msg += f" - Hint: {error_data['hint']}"
            except:
                error_msg += f": {response.text[:200]}"
            
            print(f"❌ Error reporting stats: {error_msg}")
            
            # Provide helpful error messages
            if response.status_code == 404:
                print("   💡 Hint: The RPC function 'upsert_daily_stats' may not exist.")
                print("      Please create it in your Supabase database.")
            elif response.status_code == 401:
                print("   💡 Hint: Check that SUPABASE_SERVICE_KEY is correct.")
            elif response.status_code == 403:
                print("   💡 Hint: The service role key may not have permission to call this function.")
            
            sys.exit(1)
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {str(e)}")
        sys.exit(1)


def print_summary(result: Dict[str, Any]) -> None:
    """
    Print a summary of the reported stats.
    
    Args:
        result: Response from Supabase RPC function
    """
    print("\n📋 Stats Summary:")
    print("   " + "-" * 50)
    
    if isinstance(result, dict):
        for key, value in result.items():
            print(f"   {key}: {value}")
    elif isinstance(result, list) and len(result) > 0:
        # If result is an array, print the first item
        if isinstance(result[0], dict):
            for key, value in result[0].items():
                print(f"   {key}: {value}")
        else:
            print(f"   Result: {result[0]}")
    else:
        print(f"   Result: {result}")
    
    print("   " + "-" * 50)


def main():
    """
    Main function to handle command-line execution.
    """
    # Check if required arguments are provided
    if len(sys.argv) < 4:
        print("❌ Error: Missing required arguments")
        print("\nUsage:")
        print(f"  python {sys.argv[0]} <interaction_count> <input_tokens> <output_tokens>")
        print("\nExample:")
        print(f"  python {sys.argv[0]} 10 5000 3000")
        sys.exit(1)
    
    try:
        interaction_count = int(sys.argv[1])
        input_tokens = int(sys.argv[2])
        output_tokens = int(sys.argv[3])
    except ValueError as e:
        print(f"❌ Error: Invalid argument format. All arguments must be integers.")
        print(f"   {str(e)}")
        sys.exit(1)
    
    # Validate arguments
    if interaction_count < 0 or input_tokens < 0 or output_tokens < 0:
        print("❌ Error: All values must be non-negative integers")
        sys.exit(1)
    
    print("🚀 Supabase Stats Reporting")
    print("=" * 60)
    
    # Load session
    print("\n1️⃣ Loading session...")
    session_data = load_session()
    print(f"   ✓ Session loaded from {SESSION_FILE}")
    
    # Extract access token
    access_token = get_access_token(session_data)
    print(f"   ✓ Access token found")
    
    # Extract user ID (optional)
    user_id = get_user_id(session_data)
    if user_id:
        print(f"   ✓ User ID: {user_id}")
    
    # Get service role key
    print("\n2️⃣ Checking service role key...")
    service_key = get_service_role_key()
    print(f"   ✓ Service role key found")
    
    # Report stats
    print("\n3️⃣ Reporting stats...")
    result = report_stats(
        interaction_count=interaction_count,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        access_token=access_token,
        service_key=service_key,
        user_id=user_id
    )
    
    # Print summary
    print_summary(result)
    
    print("\n✅ Done! Stats have been reported successfully.")


if __name__ == "__main__":
    main()
