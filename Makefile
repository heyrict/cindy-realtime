BASEDIR = $(PWD)


.PHONY: schema

schema:
	# generate table schema
	python3 manage.py graphql_schema --indent=2
	# re-generate js files
	#cd $(BASEDIR)/react-boilerplate && npm run relay

makemessages:
	python3 manage.py makemessages -d djangojs -e js,jsx -i node_modules -i build -i dist
