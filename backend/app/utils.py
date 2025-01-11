from datetime import datetime

def validate_datetime(date_str, date_format="%Y-%m-%d %H:%M:%S"):
    """
    Validate whether the given string is in the correct datetime format.
    :param date_str: The datetime string to validate.
    :param date_format: The format to validate against (default: "%Y-%m-%d %H:%M:%S").
    :return: True if valid, False otherwise.
    """
    try:
        datetime.strptime(date_str, date_format)
        return True
    except ValueError:
        return False

def calculate_discount(points, price, point_value=0.01):
    """
    Calculate the discount based on user points and the price.
    :param points: The total points available for the user.
    :param price: The original price of the product or service.
    :param point_value: Value of each point (default: 1 point = 1% discount).
    :return: Tuple (discount_amount, remaining_points).
    """
    discount = min(points * point_value, price)
    points_used = int(discount / point_value)
    return discount, points_used


def update_points(user, points_used):
    """
    Deduct points from the user after a transaction.
    :param user: The user object.
    :param points_used: The number of points to deduct.
    :return: None
    """
    if user.points >= points_used:
        user.points -= points_used
    else:
        raise ValueError("Insufficient points")


def format_response(success=True, message=None, data=None):
    """
    Standardize API response format.
    :param success: Boolean indicating success or failure.
    :param message: A message describing the response.
    :param data: Additional data to include in the response.
    :return: Dictionary representing the response.
    """
    return {
        "success": success,
        "message": message,
        "data": data
    }
