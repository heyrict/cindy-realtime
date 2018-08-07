BASEDIR = $(PWD)
PYTHON_EXECUTABLE = python3


.PHONY: schema

schema:
	# generate table schema
	$(PYTHON_EXECUTABLE) manage.py graphql_schema --indent=2
	# re-generate js files
	#cd $(BASEDIR)/react-boilerplate && npm run relay
	$(PYTHON_EXECUTABLE) dumpFragmentType.py > ./react-boilerplate/fragmentTypes.json

makemessages:
	$(PYTHON_EXECUTABLE) manage.py makemessages -d djangojs -e js,jsx -i node_modules -i build -i dist

push:
	# Run webpack locally, then push built assets to remote server.
	# Make sure CINDY_SERVER, CINDY_USERNAME, CINDY_PASSWORD, CINDY_ROOTPATH, CINDY_PYTHONPATH
	# exists in your environment variable.
	# *THIS SCRIPT WON'T PUSH SERVER CHANGES TO REMOTE SERVER*
	make schema
	cd ./react-boilerplate && npm run build
	$(PYTHON_EXECUTABLE) manage.py collectstatic --no-input -c
	echo 'cd $(CINDY_ROOTPATH) && git pull'\
		| ssh $(CINDY_USERNAME)@$(CINDY_SERVER) 'bash -s'
	echo 'rm -rf $(CINDY_ROOTPATH)/collected_static && mkdir $(CINDY_ROOTPATH)/collected_static' | ssh $(CINDY_USERNAME)@$(CINDY_SERVER) 'bash -s'
	rsync -rz ./collected_static/* $(CINDY_USERNAME)@$(CINDY_SERVER):$(CINDY_ROOTPATH)/collected_static
	ssh $(CINDY_USERNAME)@$(CINDY_SERVER) 'echo "$(CINDY_PASSWORD)" | sudo -S service daphne restart'

push_with_migrate:
	# Run webpack locally, then push built assets to remote server.
	# Make sure CINDY_SERVER, CINDY_USERNAME, CINDY_PASSWORD, CINDY_ROOTPATH, CINDY_PYTHONPATH
	# exists in your environment variable.
	# *THIS SCRIPT WON'T PUSH SERVER CHANGES TO REMOTE SERVER*
	make schema
	cd ./react-boilerplate && npm run build
	$(PYTHON_EXECUTABLE) manage.py collectstatic --no-input -c
	echo 'cd $(CINDY_ROOTPATH) && git pull && $(CINDY_PYTHONPATH) manage.py makemigrations && $(CINDY_PYTHONPATH) manage.py migrate'\
		| ssh $(CINDY_USERNAME)@$(CINDY_SERVER) 'bash -s'
	echo 'rm -rf $(CINDY_ROOTPATH)/collected_static && mkdir $(CINDY_ROOTPATH)/collected_static' | ssh $(CINDY_USERNAME)@$(CINDY_SERVER) 'bash -s'
	rsync -rz ./collected_static/* $(CINDY_USERNAME)@$(CINDY_SERVER):$(CINDY_ROOTPATH)/collected_static
	ssh $(CINDY_USERNAME)@$(CINDY_SERVER) 'echo "$(CINDY_PASSWORD)" | sudo -S service daphne restart'

initdb:
	###### Create an admin user ######
	$(PYTHON_EXECUTABLE) manage.py createsuperuser
	###### Create initial objects ######
	cat ./tools/initdb.py | $(PYTHON_EXECUTABLE) manage.py shell
