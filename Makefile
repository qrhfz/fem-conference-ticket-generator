TARGET=build/output.zip

all: $(TARGET)

$(TARGET): build/output
	cd build/output && zip -r ../output.zip * && cd ../..

build/output:
	mkdir -p build/output
	cp -r assets scripts index.html build/output
	sass scss/style.scss build/output/style.css

clean:
	rm -r build

.PHONY: all clean