#
# to be used by demo developer
#

ifndef ACCOUNT_SID
$(error 'ACCOUNT_SID enviroment variable not defined')
endif
ifndef AUTH_TOKEN
$(error 'AUTH_TOKEN enviroment variable not defined')
endif

USERNAME := $(shell whoami)

targets:
	@echo ---------- $@
	@grep '^[A-Za-z0-9\-]*:' Makefile | cut -d ':' -f 1 | sort


get-urls:
	@echo ---------- $@
	./tool-generate-urls.sh


send-sms:
	@echo ---------- $@
	./tool-send-patient-sms.sh


view:
	@echo ---------- $@
	twilio rtc:apps:video:view


delete:
	@echo ---------- $@
	twilio rtc:apps:video:delete


deploy:
	@echo ---------- $@
	npm run deploy:twilio-cli

	./tool-deploy-functions.sh
