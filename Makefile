

uname=$(shell uname)

## Handle verbosity
# if VERBOSE=1, then AT resolves to @, nothing otherwise
ifeq ("$(VERBOSE)","1")
AT :=
vecho = @echo
devnull :=
else
AT := @
vecho = @true
devnull := > /dev/null 2>&1 
endif

## Color output
define colorecho
      @tput setaf 6
      @echo $1
      @tput sgr0
endef

## Help

define help

Makefile targets
  help       - this help message
  clean      - clean all output of all notebooks
  all        - install miniconda build docker, etc

endef
export help

#: list main tasks
help:
	@echo "$$help"
	@printf -- "-- Using %d threads to build --\n" "${NPROC}"


all: miniconda packages


packages: 
	@$(call colorecho, "installing packages")
	$(AT)./miniconda/bin/pip install h5py nibabel numpy tensorflow tensorboard progressbar2 keras jupyter keras-resnet openpyxl pandas $(devnull)

miniconda: miniconda.sh
	@$(call colorecho, "installing miniconda")
	$(AT)./miniconda.sh -f -b -p ./miniconda $(devnull)

clean:
	$(AT)find . -name '*.ipynb' -not -path '*miniconda*' -not -path '*checkpoint*' -exec ./miniconda/bin/jupyter nbconvert --clear-output --inplace {} \;

#: download miniconda, prep for install
miniconda.sh:
ifeq ($(uname),Darwin)
	$(AT)wget -O miniconda.sh https://repo.continuum.io/miniconda/Miniconda2-latest-MacOSX-x86_64.sh $(devnull)
else
	$(AT)wget -O miniconda.sh https://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh $(devnull)
endif
	$(AT)chmod 755 miniconda.sh $(devnull)

