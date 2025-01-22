TARGET=build/output.zip

all: $(TARGET)

$(TARGET): build/output build/output/index.html build/output/style.css build/output/scripts/* build/output/assets/*
	cd build/output && zip -r ../output.zip * && cd ../..

build/output:
	mkdir -p build/output

build/output/index.html:
	cp -r index.html build/output

build/output/style.css:
	sass scss/style.scss build/output/style.css

build/output/scripts/*:
	cp -r scripts build/output

build/output/assets/*:
	cp -r assets build/output

clean:
	rm -r build

.PHONY: all clean