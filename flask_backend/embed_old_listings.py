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

def flatten_descriptions(description):
    """Recursively flatten nested lists into a flat list of strings."""
    if isinstance(description, str):
        return [description]
    elif isinstance(description, list):
        flat = []
        for item in description:
            flat.extend(flatten_descriptions(item))
        return flat
    else:
        return []


def embed_all_users_skills_only():
    print("Fetching all users...")

    result = supabase.schema("SP2024-4").table("UserProfile").select("UserID").execute()
    user_profiles = result.data

    for profile in user_profiles:
        user_id = profile['UserID']

        # Fetch skills for this user
        skills_result = supabase.schema("SP2024-4").table("UserSkill").select("Description").eq("UserID", user_id).execute()
        skills = skills_result.data

        if not skills:
            print(f"No skills found for user {user_id}")
            continue

        # Collect all skill descriptions
        skill_texts = []
        for skill in skills:
            description = skill['Description']
            skill_texts.extend(flatten_descriptions(description))

        text_to_embed = ' '.join(skill_texts)


        if not text_to_embed.strip():
            print(f"Empty skill descriptions for user {user_id}")
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
    """Embed all job listings into the Listing table, excluding company name from the text"""
    print("Fetching all listings...")

    # Fetch listings from the database
    listings_result = supabase.schema("SP2024-4").table("Listing").select(
        "ListingID", "Position", "Qualification", "RoleDescription", "Detail", "CompanyID"
    ).execute()
    listings = listings_result.data

    # Loop through all listings to generate and update embeddings
    for listing in listings:
        listing_id = listing['ListingID']
        company_id = listing.get('CompanyID')

        # Fetch company info (but we won't include the company name in the embedding)
        company_result = supabase.schema("SP2024-4").table("Company").select("CompanyName").eq("CompanyID", company_id).single().execute()
        company = company_result.data

        # Build text block (only listing details, without company name)
        text_to_embed = []
        if listing:
            text_to_embed.append(listing.get('Position', ''))
            qualifications = listing.get('Qualification', [])
            if isinstance(qualifications, list):
                text_to_embed.append(' '.join(qualifications))
            else:
                text_to_embed.append(qualifications)
            text_to_embed.append(listing.get('RoleDescription', ''))
            text_to_embed.append(listing.get('Detail', ''))

        # Join all parts and filter out any empty values
        text_to_embed = '\n'.join(filter(None, text_to_embed))

        if not text_to_embed.strip():
            print(f"Empty listing content for listing {listing_id}")
            continue

        # Generate embedding (you need to define generate_embedding function)
        embedding = generate_embedding(text_to_embed)
        embedding_json = json.dumps(embedding)

        # Update the listing with the new embedding in the database
        print(f"Updating embedding for listing {listing_id}...")
        supabase.schema("SP2024-4").table("Listing").update({
            "embedding": embedding_json
        }).eq("ListingID", listing_id).execute()

        print(f"Successfully updated listing {listing_id}")
def main():
    # embed_all_users_skills_only()
    embed_all_listings()
    print("All embeddings updated successfully!")

# === MAIN ===
if __name__ == "__main__":
    main()
