from supabase_client import supabase
from openai import OpenAI
import json
import time



# === CONFIGURATION ===
OPENAI_API_KEY = "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"

# === INITIALIZE OPENAI ===
openai = OpenAI(api_key=OPENAI_API_KEY)

# === FUNCTIONS ===

def generate_embedding(text):
    """Generate an embedding using OpenAI"""
    response = openai.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding


def embed_all_users_skills_only():
    print("Fetching all user profiles...")

    result = supabase.schema("SP2024-4").table("UserProfile").select("UserID", "PortfolioSummary").execute()
    user_profiles = result.data

    for profile in user_profiles:
        user_id = profile['UserID']
        summary_parts = profile.get('PortfolioSummary', [])

        # Join text[] array into a single string
        if isinstance(summary_parts, list):
            text_to_embed = '\n'.join(summary_parts)
        else:
            text_to_embed = str(summary_parts)

        if not text_to_embed.strip():
            print(f"Empty PortfolioSummary for user {user_id}")
            continue

        # Generate embedding
        embedding = generate_embedding(text_to_embed)
        embedding_json = json.dumps(embedding)

        # Update UserProfile
        print(f"Updating embedding for user {user_id}...")
        supabase.schema("SP2024-4").table("UserProfile").update({
            "profile_embedding": embedding_json
        }).eq("UserID", user_id).execute()

        print(f"Successfully updated user {user_id}")

def embed_all_listings():
    """Embed all job listings using only GenerativeSummary text"""
    print("Fetching all listings...")

    # Fetch listings from the database
    listings_result = supabase.schema("SP2024-4").table("Listing").select(
        "ListingID", "GenerativeSummary"
    ).execute()
    listings = listings_result.data

    for listing in listings:
        listing_id = listing['ListingID']
        summary_parts = listing.get('GenerativeSummary', [])

        # Join array into single string
        if isinstance(summary_parts, list):
            text_to_embed = '\n'.join(summary_parts)
        else:
            text_to_embed = str(summary_parts)

        if not text_to_embed.strip():
            print(f"Empty GenerativeSummary for listing {listing_id}")
            continue

        # Generate embedding
        embedding = generate_embedding(text_to_embed)
        embedding_json = json.dumps(embedding)

        # Update the listing embedding
        print(f"Updating embedding for listing {listing_id}...")
        supabase.schema("SP2024-4").table("Listing").update({
            "embedding": embedding_json
        }).eq("ListingID", listing_id).execute()

        print(f"Successfully updated listing {listing_id}")
        
def main():
    embed_all_users_skills_only()
    embed_all_listings()
    print("All embeddings updated successfully!")

# === MAIN ===
if __name__ == "__main__":
    main()
