#!/usr/bin/env python3
"""
Supabase Stats Reporting Script

This script reports daily statistics (interaction count, input tokens, output tokens)
to Supabase by calling an RPC function that handles upsert logic.

This version is designed for Agent environments and relies on environment variables
for configuration instead of user-specific session files.

Usage:
    python report_stats.py <interaction_count> <input_tokens> <output_tokens>

Example:
    python report_stats.py 10 5000 3000

Environment Variables Required:
    SUPABASE_URL: Supabase project URL
    SUPABASE_SERVICE_KEY: Supabase service role key
"""

import os
import sys
import requests
from typing import Dict, Any


def get_supabase_url() -> str:
    """
    Get Supabase URL from environment variable.
    
    Returns:
        str: Supabase project URL
        
    Raises:
        SystemExit: If environment variable is not set
    """
    supabase_url = os.getenv("SUPABASE_URL")
    
    if not supabase_url:
        print("❌ Error: SUPABASE_URL environment variable is not set.")
        print("   Please set it before running this script:")
        print("   export SUPABASE_URL='https://your-project.supabase.co'")
        sys.exit(1)
    
    return supabase_url


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
    supabase_url: str,
    service_key: str
) -> Dict[str, Any]:
    """
    Report statistics to Supabase by calling the upsert_daily_stats RPC function.
    
    Args:
        interaction_count: Number of interactions
        input_tokens: Number of input tokens
        output_tokens: Number of output tokens
        supabase_url: Supabase project URL
        service_key: Supabase service role key (for authentication)
        
    Returns:
        dict: Response from Supabase
        
    Raises:
        SystemExit: If the request fails
    """
    rpc_endpoint = f"{supabase_url}/rest/v1/rpc/upsert_daily_stats"
    
    headers = {
        "Content-Type": "application/json",
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
    }
    
    # Prepare payload for RPC function
    payload = {
        "interaction_count": interaction_count,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
    }
    
    print(f"📊 Reporting stats to Supabase...")
    print(f"   Endpoint: {rpc_endpoint}")
    print(f"   Interaction Count: {interaction_count}")
    print(f"   Input Tokens: {input_tokens}")
    print(f"   Output Tokens: {output_tokens}")
    
    try:
        response = requests.post(
            rpc_endpoint,
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
        print("\nEnvironment Variables Required:")
        print("  SUPABASE_URL: Supabase project URL")
        print("  SUPABASE_SERVICE_KEY: Supabase service role key")
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
    
    # Get Supabase URL from environment
    print("\n1️⃣ Checking configuration...")
    supabase_url = get_supabase_url()
    print(f"   ✓ Supabase URL: {supabase_url}")
    
    # Get service role key
    service_key = get_service_role_key()
    print(f"   ✓ Service role key found")
    
    # Report stats
    print("\n2️⃣ Reporting stats...")
    result = report_stats(
        interaction_count=interaction_count,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        supabase_url=supabase_url,
        service_key=service_key
    )
    
    # Print summary
    print_summary(result)
    
    print("\n✅ Done! Stats have been reported successfully.")


if __name__ == "__main__":
    main()
