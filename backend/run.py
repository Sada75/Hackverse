from app import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)

#if facing issues try enabling cors 
# rn no admin for adding entries to the db
# need to write the point fetching algorithm using solidity to use metamask id to fetch points
# also have to implemnt metamask in the functions of utils.py to perform actual transactions/ operations on the id