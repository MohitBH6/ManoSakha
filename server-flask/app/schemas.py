def validate_register_payload(data, role):
    required_common = ["full_name", "email", "password", "phone", "gender", "dob"]
    if role == "student":
        required = required_common + ["roll_no", "department", "year", "section"]
    elif role == "counsellor":
        required = required_common + ["employee_id", "qualification", "specialization"]
    else:
        return f"Invalid role: {role}"

    missing = [field for field in required if not data.get(field)]
    if missing:
        return f"Missing required fields: {', '.join(missing)}"
    return None