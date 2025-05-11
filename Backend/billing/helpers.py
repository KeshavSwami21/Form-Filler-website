import uuid

def generate_promo_code():
    return f"MEXT_{str(uuid.uuid4())[:5]}"
