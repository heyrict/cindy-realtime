BASEDIR = $(PWD)


.PHONY: schema

schema:
	# generate table schema
	python3 manage.py graphql_schema --indent=2
	# re-generate js files
	cd $(BASEDIR)/sui_hei/static/js && npm run relay
