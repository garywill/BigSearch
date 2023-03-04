/*!
 LZ-UTF8 v0.5.8
 Copyright (c) 2021, Rotem Dan
 Released under the MIT license.
 Please report any issue at https://github.com/rotemdan/lzutf8.js/issues
*/
/*
Copyright (c) 2014-2018, Rotem Dan <rotemdan@gmail.com>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/
var LZUTF8;
(function(LZUTF8){
	LZUTF8.runningInNodeJS=function(){
		return((typeof process==="object")&&(typeof process.versions==="object")&&(typeof process.versions.node==="string"));
	};
	LZUTF8.runningInMainNodeJSModule=function(){
		return LZUTF8.runningInNodeJS()&&require.main===module;
	};
	LZUTF8.commonJSAvailable=function(){
		return typeof module==="object"&&typeof module.exports==="object";
	};
	LZUTF8.runningInWebWorker=function(){
		return typeof window==="undefined"&&typeof self==="object"&&typeof self.addEventListener==="function"&&typeof self.close==="function";
	};
	LZUTF8.runningInNodeChildProcess=function(){
		return LZUTF8.runningInNodeJS()&&typeof process.send==="function";
	};
	LZUTF8.runningInNullOrigin=function(){
		if(typeof window !=="object"||typeof window.location !=="object"||typeof document !=="object")
			return false;
		return document.location.protocol !=='http:'&&document.location.protocol !=='https:';
	};
	LZUTF8.webWorkersAvailable=function(){
		if(typeof Worker !=="function"||LZUTF8.runningInNullOrigin())
			return false;
		if(LZUTF8.runningInNodeJS())
			return false;
		if(navigator&&navigator.userAgent&&navigator.userAgent.indexOf("Android 4.3")>=0)
			return false;
		return true;
	};
	LZUTF8.log=function(message, appendToDocument){
		if(appendToDocument===void 0){ appendToDocument=false; }
		if(typeof console !=="object")
			return;
		console.log(message);
		//if(appendToDocument&&typeof document=="object")
		//	document.body.innerHTML +=message + "<br/>";
	};
	LZUTF8.createErrorMessage=function(exception, title){
		if(title===void 0){ title="Unhandled exception"; }
		if(exception==null)
			return title;
		title +=": ";
		if(typeof exception.content==="object"){
			if(LZUTF8.runningInNodeJS()){
				return title + exception.content.stack;
			}
			else {
				var exceptionJSON=JSON.stringify(exception.content);
				if(exceptionJSON !=="{}")
					return title + exceptionJSON;
				else
					return title + exception.content;
			}
		}
		else if(typeof exception.content==="string"){
			return title + exception.content;
		}
		else {
			return title + exception;
		}
	};
	LZUTF8.printExceptionAndStackTraceToConsole=function(exception, title){
		if(title===void 0){ title="Unhandled exception"; }
		LZUTF8.log(LZUTF8.createErrorMessage(exception, title));
	};
	LZUTF8.getGlobalObject=function(){
		if(typeof global==="object")
			return global;
		else if(typeof window==="object")
			return window;
		else if(typeof self==="object")
			return self;
		else
			return {};
	};
	LZUTF8.toString=Object.prototype.toString;
	if(LZUTF8.commonJSAvailable())
		module.exports=LZUTF8;
})(LZUTF8||(LZUTF8={}));


var LZUTF8;
(function(LZUTF8){
	var ArraySegment=(function(){
		function ArraySegment(container, startPosition, length){
			this.container=container;
			this.startPosition=startPosition;
			this.length=length;
		}
		ArraySegment.prototype.get=function(index){
			return this.container[this.startPosition + index];
		};
		ArraySegment.prototype.getInReversedOrder=function(reverseIndex){
			return this.container[this.startPosition + this.length - 1 - reverseIndex];
		};
		ArraySegment.prototype.set=function(index, value){
			this.container[this.startPosition + index]=value;
		};
		return ArraySegment;
	}());
	LZUTF8.ArraySegment=ArraySegment;
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var ArrayTools;
	(function(ArrayTools){
		ArrayTools.copyElements=function(source, sourceIndex, destination, destinationIndex, count){
			while(count--)
				destination[destinationIndex++]=source[sourceIndex++];
		};
		ArrayTools.zeroElements=function(collection, index, count){
			while(count--)
				collection[index++]=0;
		};
		ArrayTools.countNonzeroValuesInArray=function(array){
			var result=0;
			for(var i=0; i < array.length; i++)
				if(array[i])
					result++;
			return result;
		};
		ArrayTools.truncateStartingElements=function(array, truncatedLength){
			if(array.length <=truncatedLength)
				throw new RangeError("truncateStartingElements: Requested length should be smaller than array length");
			var sourcePosition=array.length - truncatedLength;
			for(var i=0; i < truncatedLength; i++)
				array[i]=array[sourcePosition + i];
			array.length=truncatedLength;
		};
		ArrayTools.doubleByteArrayCapacity=function(array){
			var newArray=new Uint8Array(array.length * 2);
			newArray.set(array);
			return newArray;
		};
		ArrayTools.concatUint8Arrays=function(arrays){
			var totalLength=0;
			for(var _i=0, arrays_1=arrays; _i < arrays_1.length; _i++){
				var array=arrays_1[_i];
				totalLength +=array.length;
			}
			var result=new Uint8Array(totalLength);
			var offset=0;
			for(var _a=0, arrays_2=arrays; _a < arrays_2.length; _a++){
				var array=arrays_2[_a];
				result.set(array, offset);
				offset +=array.length;
			}
			return result;
		};
		ArrayTools.splitByteArray=function(byteArray, maxPartLength){
			var result=[];
			for(var offset=0; offset < byteArray.length;){
				var blockLength=Math.min(maxPartLength, byteArray.length - offset);
				result.push(byteArray.subarray(offset, offset + blockLength));
				offset +=blockLength;
			}
			return result;
		};
	})(ArrayTools=LZUTF8.ArrayTools||(LZUTF8.ArrayTools={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var BufferTools;
	(function(BufferTools){
		BufferTools.convertToUint8ArrayIfNeeded=function(input){
			if(typeof Buffer==="function"&&Buffer.isBuffer(input))
				return BufferTools.bufferToUint8Array(input);
			else
				return input;
		};
		BufferTools.uint8ArrayToBuffer=function(arr){
			if(Buffer.prototype instanceof Uint8Array){
				var arrClone=new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
				Object["setPrototypeOf"](arrClone, Buffer.prototype);
				return arrClone;
			}
			else {
				var len=arr.length;
				var buf=new Buffer(len);
				for(var i=0; i < len; i++)
					buf[i]=arr[i];
				return buf;
			}
		};
		BufferTools.bufferToUint8Array=function(buf){
			if(Buffer.prototype instanceof Uint8Array){
				return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]);
			}
			else {
				var len=buf.length;
				var arr=new Uint8Array(len);
				for(var i=0; i < len; i++)
					arr[i]=buf[i];
				return arr;
			}
		};
	})(BufferTools=LZUTF8.BufferTools||(LZUTF8.BufferTools={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var CompressionCommon;
	(function(CompressionCommon){
		CompressionCommon.getCroppedBuffer=function(buffer, cropStartOffset, cropLength, additionalCapacity){
			if(additionalCapacity===void 0){ additionalCapacity=0; }
			var croppedBuffer=new Uint8Array(cropLength + additionalCapacity);
			croppedBuffer.set(buffer.subarray(cropStartOffset, cropStartOffset + cropLength));
			return croppedBuffer;
		};
		CompressionCommon.getCroppedAndAppendedByteArray=function(bytes, cropStartOffset, cropLength, byteArrayToAppend){
			return LZUTF8.ArrayTools.concatUint8Arrays([bytes.subarray(cropStartOffset, cropStartOffset + cropLength), byteArrayToAppend]);
		};
		CompressionCommon.detectCompressionSourceEncoding=function(input){
			if(input==null)
				throw new TypeError("detectCompressionSourceEncoding: input is null or undefined");
			if(typeof input==="string")
				return "String";
			else if(input instanceof Uint8Array||(typeof Buffer==="function"&&Buffer.isBuffer(input)))
				return "ByteArray";
			else
				throw new TypeError("detectCompressionSourceEncoding: input must be of type 'string', 'Uint8Array' or 'Buffer'");
		};
		CompressionCommon.encodeCompressedBytes=function(compressedBytes, outputEncoding){
			switch(outputEncoding){
				case "ByteArray":
					return compressedBytes;
				case "Buffer":
					return LZUTF8.BufferTools.uint8ArrayToBuffer(compressedBytes);
				case "BinaryString":
					return LZUTF8.encodeBinaryString(compressedBytes);
				case "StorageBinaryString":
					return LZUTF8.encodeStorageBinaryString(compressedBytes);
				default:
					throw new TypeError("encodeCompressedBytes: invalid output encoding requested");
			}
		};
		CompressionCommon.decodeCompressedBytes=function(compressedData, inputEncoding){
			if(inputEncoding==null)
				throw new TypeError("decodeCompressedData: Input is null or undefined");
			switch(inputEncoding){
				case "ByteArray":
				case "Buffer":
					var normalizedBytes=LZUTF8.BufferTools.convertToUint8ArrayIfNeeded(compressedData);
					if(!(normalizedBytes instanceof Uint8Array))
						throw new TypeError("decodeCompressedData: 'ByteArray' or 'Buffer' input type was specified but input is not a Uint8Array or Buffer");
					return normalizedBytes;
				case "BinaryString":
					if(typeof compressedData !=="string")
						throw new TypeError("decodeCompressedData: 'BinaryString' input type was specified but input is not a string");
					return LZUTF8.decodeBinaryString(compressedData);
				case "StorageBinaryString":
					if(typeof compressedData !=="string")
						throw new TypeError("decodeCompressedData: 'StorageBinaryString' input type was specified but input is not a string");
					return LZUTF8.decodeStorageBinaryString(compressedData);
				default:
					throw new TypeError("decodeCompressedData: invalid input encoding requested: '" + inputEncoding + "'");
			}
		};
		CompressionCommon.encodeDecompressedBytes=function(decompressedBytes, outputEncoding){
			switch(outputEncoding){
				case "String":
					return LZUTF8.decodeUTF8(decompressedBytes);
				case "ByteArray":
					return decompressedBytes;
				case "Buffer":
					if(typeof Buffer !=="function")
						throw new TypeError("encodeDecompressedBytes: a 'Buffer' type was specified but is not supported at the current envirnment");
					return LZUTF8.BufferTools.uint8ArrayToBuffer(decompressedBytes);
				default:
					throw new TypeError("encodeDecompressedBytes: invalid output encoding requested");
			}
		};
	})(CompressionCommon=LZUTF8.CompressionCommon||(LZUTF8.CompressionCommon={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var ObjectTools;
	(function(ObjectTools){
		ObjectTools.override=function(obj, newPropertyValues){
			return ObjectTools.extend(obj, newPropertyValues);
		};
		ObjectTools.extend=function(obj, newProperties){
			if(obj==null)
				throw new TypeError("obj is null or undefined");
			if(typeof obj !=="object")
				throw new TypeError("obj is not an object");
			if(newProperties==null)
				newProperties={};
			if(typeof newProperties !=="object")
				throw new TypeError("newProperties is not an object");
			if(newProperties !=null){
				for(var property in newProperties)
					obj[property]=newProperties[property];
			}
			return obj;
		};
	})(ObjectTools=LZUTF8.ObjectTools||(LZUTF8.ObjectTools={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var StringBuilder=(function(){
		function StringBuilder(outputBufferCapacity){
			if(outputBufferCapacity===void 0){ outputBufferCapacity=1024; }
			this.outputBufferCapacity=outputBufferCapacity;
			this.outputPosition=0;
			this.outputString="";
			this.outputBuffer=new Uint16Array(this.outputBufferCapacity);
		}
		StringBuilder.prototype.appendCharCode=function(charCode){
			this.outputBuffer[this.outputPosition++]=charCode;
			if(this.outputPosition===this.outputBufferCapacity)
				this.flushBufferToOutputString();
		};
		StringBuilder.prototype.appendCharCodes=function(charCodes){
			for(var i=0, length_1=charCodes.length; i < length_1; i++)
				this.appendCharCode(charCodes[i]);
		};
		StringBuilder.prototype.appendString=function(str){
			for(var i=0, length_2=str.length; i < length_2; i++)
				this.appendCharCode(str.charCodeAt(i));
		};
		StringBuilder.prototype.appendCodePoint=function(codePoint){
			if(codePoint <=0xFFFF){
				this.appendCharCode(codePoint);
			}
			else if(codePoint <=0x10FFFF){
				this.appendCharCode(0xD800 +((codePoint - 0x10000)>>> 10));
				this.appendCharCode(0xDC00 +((codePoint - 0x10000)& 1023));
			}
			else
				throw new Error("appendCodePoint: A code point of " + codePoint + " cannot be encoded in UTF-16");
		};
		StringBuilder.prototype.getOutputString=function(){
			this.flushBufferToOutputString();
			return this.outputString;
		};
		StringBuilder.prototype.flushBufferToOutputString=function(){
			if(this.outputPosition===this.outputBufferCapacity)
				this.outputString +=String.fromCharCode.apply(null, this.outputBuffer);
			else
				this.outputString +=String.fromCharCode.apply(null, this.outputBuffer.subarray(0, this.outputPosition));
			this.outputPosition=0;
		};
		return StringBuilder;
	}());
	LZUTF8.StringBuilder=StringBuilder;
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var Compressor=(function(){
		function Compressor(useCustomHashTable){
			if(useCustomHashTable===void 0){ useCustomHashTable=true; }
			this.MinimumSequenceLength=4;
			this.MaximumSequenceLength=31;
			this.MaximumMatchDistance=32767;
			this.PrefixHashTableSize=65537;
			this.inputBufferStreamOffset=1;
			if(useCustomHashTable&&typeof Uint32Array=="function")
				this.prefixHashTable=new LZUTF8.CompressorCustomHashTable(this.PrefixHashTableSize);
			else
				this.prefixHashTable=new LZUTF8.CompressorSimpleHashTable(this.PrefixHashTableSize);
		}
		Compressor.prototype.compressBlock=function(input){
			if(input===undefined||input===null)
				throw new TypeError("compressBlock: undefined or null input received");
			if(typeof input=="string")
				input=LZUTF8.encodeUTF8(input);
			input=LZUTF8.BufferTools.convertToUint8ArrayIfNeeded(input);
			return this.compressUtf8Block(input);
		};
		Compressor.prototype.compressUtf8Block=function(utf8Bytes){
			if(!utf8Bytes||utf8Bytes.length==0)
				return new Uint8Array(0);
			var bufferStartingReadOffset=this.cropAndAddNewBytesToInputBuffer(utf8Bytes);
			var inputBuffer=this.inputBuffer;
			var inputBufferLength=this.inputBuffer.length;
			this.outputBuffer=new Uint8Array(utf8Bytes.length);
			this.outputBufferPosition=0;
			var latestMatchEndPosition=0;
			for(var readPosition=bufferStartingReadOffset; readPosition < inputBufferLength; readPosition++){
				var inputValue=inputBuffer[readPosition];
				var withinAMatchedRange=readPosition < latestMatchEndPosition;
				if(readPosition > inputBufferLength - this.MinimumSequenceLength){
					if(!withinAMatchedRange)
						this.outputRawByte(inputValue);
					continue;
				}
				var targetBucketIndex=this.getBucketIndexForPrefix(readPosition);
				if(!withinAMatchedRange){
					var matchLocator=this.findLongestMatch(readPosition, targetBucketIndex);
					if(matchLocator !=null){
						this.outputPointerBytes(matchLocator.length, matchLocator.distance);
						latestMatchEndPosition=readPosition + matchLocator.length;
						withinAMatchedRange=true;
					}
				}
				if(!withinAMatchedRange)
					this.outputRawByte(inputValue);
				var inputStreamPosition=this.inputBufferStreamOffset + readPosition;
				this.prefixHashTable.addValueToBucket(targetBucketIndex, inputStreamPosition);
			}
			return this.outputBuffer.subarray(0, this.outputBufferPosition);
		};
		Compressor.prototype.findLongestMatch=function(matchedSequencePosition, bucketIndex){
			var bucket=this.prefixHashTable.getArraySegmentForBucketIndex(bucketIndex, this.reusableArraySegmentObject);
			if(bucket==null)
				return null;
			var input=this.inputBuffer;
			var longestMatchDistance;
			var longestMatchLength=0;
			for(var i=0; i < bucket.length; i++){
				var testedSequencePosition=bucket.getInReversedOrder(i)- this.inputBufferStreamOffset;
				var testedSequenceDistance=matchedSequencePosition - testedSequencePosition;
				var lengthToSurpass=void 0;
				if(longestMatchDistance===undefined)
					lengthToSurpass=this.MinimumSequenceLength - 1;
				else if(longestMatchDistance < 128&&testedSequenceDistance >=128)
					lengthToSurpass=longestMatchLength +(longestMatchLength >>> 1);
				else
					lengthToSurpass=longestMatchLength;
				if(testedSequenceDistance > this.MaximumMatchDistance||
					lengthToSurpass >=this.MaximumSequenceLength||
					matchedSequencePosition + lengthToSurpass >=input.length)
					break;
				if(input[testedSequencePosition + lengthToSurpass] !==input[matchedSequencePosition + lengthToSurpass])
					continue;
				for(var offset=0;; offset++){
					if(matchedSequencePosition + offset===input.length||
						input[testedSequencePosition + offset] !==input[matchedSequencePosition + offset]){
						if(offset > lengthToSurpass){
							longestMatchDistance=testedSequenceDistance;
							longestMatchLength=offset;
						}
						break;
					}
					else if(offset===this.MaximumSequenceLength)
						return { distance: testedSequenceDistance, length: this.MaximumSequenceLength };
				}
			}
			if(longestMatchDistance !==undefined)
				return { distance: longestMatchDistance, length: longestMatchLength };
			else
				return null;
		};
		Compressor.prototype.getBucketIndexForPrefix=function(startPosition){
			return(this.inputBuffer[startPosition] * 7880599 +
				this.inputBuffer[startPosition + 1] * 39601 +
				this.inputBuffer[startPosition + 2] * 199 +
				this.inputBuffer[startPosition + 3])% this.PrefixHashTableSize;
		};
		Compressor.prototype.outputPointerBytes=function(length, distance){
			if(distance < 128){
				this.outputRawByte(192 | length);
				this.outputRawByte(distance);
			}
			else {
				this.outputRawByte(224 | length);
				this.outputRawByte(distance >>> 8);
				this.outputRawByte(distance & 255);
			}
		};
		Compressor.prototype.outputRawByte=function(value){
			this.outputBuffer[this.outputBufferPosition++]=value;
		};
		Compressor.prototype.cropAndAddNewBytesToInputBuffer=function(newInput){
			if(this.inputBuffer===undefined){
				this.inputBuffer=newInput;
				return 0;
			}
			else {
				var cropLength=Math.min(this.inputBuffer.length, this.MaximumMatchDistance);
				var cropStartOffset=this.inputBuffer.length - cropLength;
				this.inputBuffer=LZUTF8.CompressionCommon.getCroppedAndAppendedByteArray(this.inputBuffer, cropStartOffset, cropLength, newInput);
				this.inputBufferStreamOffset +=cropStartOffset;
				return cropLength;
			}
		};
		return Compressor;
	}());
	LZUTF8.Compressor=Compressor;
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var CompressorCustomHashTable=(function(){
		function CompressorCustomHashTable(bucketCount){
			this.minimumBucketCapacity=4;
			this.maximumBucketCapacity=64;
			this.bucketLocators=new Uint32Array(bucketCount * 2);
			this.storage=new Uint32Array(bucketCount * 2);
			this.storageIndex=1;
		}
		CompressorCustomHashTable.prototype.addValueToBucket=function(bucketIndex, valueToAdd){
			bucketIndex <<=1;
			if(this.storageIndex >=(this.storage.length >>> 1))
				this.compact();
			var startPosition=this.bucketLocators[bucketIndex];
			var length;
			if(startPosition===0){
				startPosition=this.storageIndex;
				length=1;
				this.storage[this.storageIndex]=valueToAdd;
				this.storageIndex +=this.minimumBucketCapacity;
			}
			else {
				length=this.bucketLocators[bucketIndex + 1];
				if(length===this.maximumBucketCapacity - 1)
					length=this.truncateBucketToNewerElements(startPosition, length, this.maximumBucketCapacity / 2);
				var endPosition=startPosition + length;
				if(this.storage[endPosition]===0){
					this.storage[endPosition]=valueToAdd;
					if(endPosition===this.storageIndex)
						this.storageIndex +=length;
				}
				else {
					LZUTF8.ArrayTools.copyElements(this.storage, startPosition, this.storage, this.storageIndex, length);
					startPosition=this.storageIndex;
					this.storageIndex +=length;
					this.storage[this.storageIndex++]=valueToAdd;
					this.storageIndex +=length;
				}
				length++;
			}
			this.bucketLocators[bucketIndex]=startPosition;
			this.bucketLocators[bucketIndex + 1]=length;
		};
		CompressorCustomHashTable.prototype.truncateBucketToNewerElements=function(startPosition, bucketLength, truncatedBucketLength){
			var sourcePosition=startPosition + bucketLength - truncatedBucketLength;
			LZUTF8.ArrayTools.copyElements(this.storage, sourcePosition, this.storage, startPosition, truncatedBucketLength);
			LZUTF8.ArrayTools.zeroElements(this.storage, startPosition + truncatedBucketLength, bucketLength - truncatedBucketLength);
			return truncatedBucketLength;
		};
		CompressorCustomHashTable.prototype.compact=function(){
			var oldBucketLocators=this.bucketLocators;
			var oldStorage=this.storage;
			this.bucketLocators=new Uint32Array(this.bucketLocators.length);
			this.storageIndex=1;
			for(var bucketIndex=0; bucketIndex < oldBucketLocators.length; bucketIndex +=2){
				var length_3=oldBucketLocators[bucketIndex + 1];
				if(length_3===0)
					continue;
				this.bucketLocators[bucketIndex]=this.storageIndex;
				this.bucketLocators[bucketIndex + 1]=length_3;
				this.storageIndex +=Math.max(Math.min(length_3 * 2, this.maximumBucketCapacity), this.minimumBucketCapacity);
			}
			this.storage=new Uint32Array(this.storageIndex * 8);
			for(var bucketIndex=0; bucketIndex < oldBucketLocators.length; bucketIndex +=2){
				var sourcePosition=oldBucketLocators[bucketIndex];
				if(sourcePosition===0)
					continue;
				var destPosition=this.bucketLocators[bucketIndex];
				var length_4=this.bucketLocators[bucketIndex + 1];
				LZUTF8.ArrayTools.copyElements(oldStorage, sourcePosition, this.storage, destPosition, length_4);
			}
		};
		CompressorCustomHashTable.prototype.getArraySegmentForBucketIndex=function(bucketIndex, outputObject){
			bucketIndex <<=1;
			var startPosition=this.bucketLocators[bucketIndex];
			if(startPosition===0)
				return null;
			if(outputObject===undefined)
				outputObject=new LZUTF8.ArraySegment(this.storage, startPosition, this.bucketLocators[bucketIndex + 1]);
			return outputObject;
		};
		CompressorCustomHashTable.prototype.getUsedBucketCount=function(){
			return Math.floor(LZUTF8.ArrayTools.countNonzeroValuesInArray(this.bucketLocators)/ 2);
		};
		CompressorCustomHashTable.prototype.getTotalElementCount=function(){
			var result=0;
			for(var i=0; i < this.bucketLocators.length; i +=2)
				result +=this.bucketLocators[i + 1];
			return result;
		};
		return CompressorCustomHashTable;
	}());
	LZUTF8.CompressorCustomHashTable=CompressorCustomHashTable;
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var CompressorSimpleHashTable=(function(){
		function CompressorSimpleHashTable(size){
			this.maximumBucketCapacity=64;
			this.buckets=new Array(size);
		}
		CompressorSimpleHashTable.prototype.addValueToBucket=function(bucketIndex, valueToAdd){
			var bucket=this.buckets[bucketIndex];
			if(bucket===undefined){
				this.buckets[bucketIndex]=[valueToAdd];
			}
			else {
				if(bucket.length===this.maximumBucketCapacity - 1)
					LZUTF8.ArrayTools.truncateStartingElements(bucket, this.maximumBucketCapacity / 2);
				bucket.push(valueToAdd);
			}
		};
		CompressorSimpleHashTable.prototype.getArraySegmentForBucketIndex=function(bucketIndex, outputObject){
			var bucket=this.buckets[bucketIndex];
			if(bucket===undefined)
				return null;
			if(outputObject===undefined)
				outputObject=new LZUTF8.ArraySegment(bucket, 0, bucket.length);
			return outputObject;
		};
		CompressorSimpleHashTable.prototype.getUsedBucketCount=function(){
			return LZUTF8.ArrayTools.countNonzeroValuesInArray(this.buckets);
		};
		CompressorSimpleHashTable.prototype.getTotalElementCount=function(){
			var currentSum=0;
			for(var i=0; i < this.buckets.length; i++){
				if(this.buckets[i] !==undefined)
					currentSum +=this.buckets[i].length;
			}
			return currentSum;
		};
		return CompressorSimpleHashTable;
	}());
	LZUTF8.CompressorSimpleHashTable=CompressorSimpleHashTable;
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var Decompressor=(function(){
		function Decompressor(){
			this.MaximumMatchDistance=32767;
			this.outputPosition=0;
		}
		Decompressor.prototype.decompressBlockToString=function(input){
			input=LZUTF8.BufferTools.convertToUint8ArrayIfNeeded(input);
			return LZUTF8.decodeUTF8(this.decompressBlock(input));
		};
		Decompressor.prototype.decompressBlock=function(input){
			if(this.inputBufferRemainder){
				input=LZUTF8.ArrayTools.concatUint8Arrays([this.inputBufferRemainder, input]);
				this.inputBufferRemainder=undefined;
			}
			var outputStartPosition=this.cropOutputBufferToWindowAndInitialize(Math.max(input.length * 4, 1024));
			for(var readPosition=0, inputLength=input.length; readPosition < inputLength; readPosition++){
				var inputValue=input[readPosition];
				if(inputValue >>> 6 !=3){
					this.outputByte(inputValue);
					continue;
				}
				var sequenceLengthIdentifier=inputValue >>> 5;
				if(readPosition==inputLength - 1||
					(readPosition==inputLength - 2&&sequenceLengthIdentifier==7)){
					this.inputBufferRemainder=input.subarray(readPosition);
					break;
				}
				if(input[readPosition + 1] >>> 7===1){
					this.outputByte(inputValue);
				}
				else {
					var matchLength=inputValue & 31;
					var matchDistance=void 0;
					if(sequenceLengthIdentifier==6){
						matchDistance=input[readPosition + 1];
						readPosition +=1;
					}
					else {
						matchDistance=(input[readPosition + 1] << 8)|(input[readPosition + 2]);
						readPosition +=2;
					}
					var matchPosition=this.outputPosition - matchDistance;
					for(var offset=0; offset < matchLength; offset++)
						this.outputByte(this.outputBuffer[matchPosition + offset]);
				}
			}
			this.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence();
			return LZUTF8.CompressionCommon.getCroppedBuffer(this.outputBuffer, outputStartPosition, this.outputPosition - outputStartPosition);
		};
		Decompressor.prototype.outputByte=function(value){
			if(this.outputPosition===this.outputBuffer.length)
				this.outputBuffer=LZUTF8.ArrayTools.doubleByteArrayCapacity(this.outputBuffer);
			this.outputBuffer[this.outputPosition++]=value;
		};
		Decompressor.prototype.cropOutputBufferToWindowAndInitialize=function(initialCapacity){
			if(!this.outputBuffer){
				this.outputBuffer=new Uint8Array(initialCapacity);
				return 0;
			}
			var cropLength=Math.min(this.outputPosition, this.MaximumMatchDistance);
			this.outputBuffer=LZUTF8.CompressionCommon.getCroppedBuffer(this.outputBuffer, this.outputPosition - cropLength, cropLength, initialCapacity);
			this.outputPosition=cropLength;
			if(this.outputBufferRemainder){
				for(var i=0; i < this.outputBufferRemainder.length; i++)
					this.outputByte(this.outputBufferRemainder[i]);
				this.outputBufferRemainder=undefined;
			}
			return cropLength;
		};
		Decompressor.prototype.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence=function(){
			for(var offset=1; offset <=4&&this.outputPosition - offset >=0; offset++){
				var value=this.outputBuffer[this.outputPosition - offset];
				if((offset < 4&&(value >>> 3)===30)||
					(offset < 3&&(value >>> 4)===14)||
					(offset < 2&&(value >>> 5)===6)){
					this.outputBufferRemainder=this.outputBuffer.subarray(this.outputPosition - offset, this.outputPosition);
					this.outputPosition -=offset;
					return;
				}
			}
		};
		return Decompressor;
	}());
	LZUTF8.Decompressor=Decompressor;
})(LZUTF8||(LZUTF8={}));

var LZUTF8;
(function(LZUTF8){
	var Encoding;
	(function(Encoding){
		var BinaryString;
		(function(BinaryString){
			BinaryString.encode=function(input){
				if(input==null)
					throw new TypeError("BinaryString.encode: undefined or null input received");
				if(input.length===0)
					return "";
				var inputLength=input.length;
				var outputStringBuilder=new LZUTF8.StringBuilder();
				var remainder=0;
				var state=1;
				for(var i=0; i < inputLength; i +=2){
					var value=void 0;
					if(i==inputLength - 1)
						value=(input[i] << 8);
					else
						value=(input[i] << 8)| input[i + 1];
					outputStringBuilder.appendCharCode((remainder <<(16 - state))| value >>> state);
					remainder=value &((1 << state)- 1);
					if(state===15){
						outputStringBuilder.appendCharCode(remainder);
						remainder=0;
						state=1;
					}
					else {
						state +=1;
					}
					if(i >=inputLength - 2)
						outputStringBuilder.appendCharCode(remainder <<(16 - state));
				}
				outputStringBuilder.appendCharCode(32768 |(inputLength % 2));
				return outputStringBuilder.getOutputString();
			};
			BinaryString.decode=function(input){
				if(typeof input !=="string")
					throw new TypeError("BinaryString.decode: invalid input type");
				if(input=="")
					return new Uint8Array(0);
				var output=new Uint8Array(input.length * 3);
				var outputPosition=0;
				var appendToOutput=function(value){
					output[outputPosition++]=value >>> 8;
					output[outputPosition++]=value & 255;
				};
				var remainder=0;
				var state=0;
				for(var i=0; i < input.length; i++){
					var value=input.charCodeAt(i);
					if(value >=32768){
						if(value==(32768 | 1))
							outputPosition--;
						state=0;
						continue;
					}
					if(state==0){
						remainder=value;
					}
					else {
						appendToOutput((remainder << state)|(value >>>(15 - state)));
						remainder=value &((1 <<(15 - state))- 1);
					}
					if(state==15)
						state=0;
					else
						state +=1;
				}
				return output.subarray(0, outputPosition);
			};
		})(BinaryString=Encoding.BinaryString||(Encoding.BinaryString={}));
	})(Encoding=LZUTF8.Encoding||(LZUTF8.Encoding={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var Encoding;
	(function(Encoding){
		var CodePoint;
		(function(CodePoint){
			CodePoint.encodeFromString=function(str, position){
				var charCode=str.charCodeAt(position);
				if(charCode < 0xD800||charCode > 0xDBFF)
					return charCode;
				else {
					var nextCharCode=str.charCodeAt(position + 1);
					if(nextCharCode >=0xDC00&&nextCharCode <=0xDFFF)
						return 0x10000 +(((charCode - 0xD800)<< 10)+(nextCharCode - 0xDC00));
					else
						throw new Error("getUnicodeCodePoint: Received a lead surrogate character, char code " + charCode + ", followed by " + nextCharCode + ", which is not a trailing surrogate character code.");
				}
			};
			CodePoint.decodeToString=function(codePoint){
				if(codePoint <=0xFFFF)
					return String.fromCharCode(codePoint);
				else if(codePoint <=0x10FFFF)
					return String.fromCharCode(0xD800 +((codePoint - 0x10000)>>> 10), 0xDC00 +((codePoint - 0x10000)& 1023));
				else
					throw new Error("getStringFromUnicodeCodePoint: A code point of " + codePoint + " cannot be encoded in UTF-16");
			};
		})(CodePoint=Encoding.CodePoint||(Encoding.CodePoint={}));
	})(Encoding=LZUTF8.Encoding||(LZUTF8.Encoding={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var Encoding;
	(function(Encoding){
		var StorageBinaryString;
		(function(StorageBinaryString){
			StorageBinaryString.encode=function(input){
				return Encoding.BinaryString.encode(input).replace(/\0/g, '\u8002');
			};
			StorageBinaryString.decode=function(input){
				return Encoding.BinaryString.decode(input.replace(/\u8002/g, '\0'));
			};
		})(StorageBinaryString=Encoding.StorageBinaryString||(Encoding.StorageBinaryString={}));
	})(Encoding=LZUTF8.Encoding||(LZUTF8.Encoding={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	var Encoding;
	(function(Encoding){
		var UTF8;
		(function(UTF8){
			var nativeTextEncoder;
			var nativeTextDecoder;
			UTF8.encode=function(str){
				if(!str||str.length==0)
					return new Uint8Array(0);
				if(LZUTF8.runningInNodeJS()){
					return LZUTF8.BufferTools.bufferToUint8Array(Buffer.from(str, "utf8"));
				}
				else if(UTF8.createNativeTextEncoderAndDecoderIfAvailable()){
					return nativeTextEncoder.encode(str);
				}
				else {
					return UTF8.encodeWithJS(str);
				}
			};
			UTF8.decode=function(utf8Bytes){
				if(!utf8Bytes||utf8Bytes.length==0)
					return "";
				if(LZUTF8.runningInNodeJS()){
					return LZUTF8.BufferTools.uint8ArrayToBuffer(utf8Bytes).toString("utf8");
				}
				else if(UTF8.createNativeTextEncoderAndDecoderIfAvailable()){
					return nativeTextDecoder.decode(utf8Bytes);
				}
				else {
					return UTF8.decodeWithJS(utf8Bytes);
				}
			};
			UTF8.encodeWithJS=function(str, outputArray){
				if(!str||str.length==0)
					return new Uint8Array(0);
				if(!outputArray)
					outputArray=new Uint8Array(str.length * 4);
				var writeIndex=0;
				for(var readIndex=0; readIndex < str.length; readIndex++){
					var charCode=Encoding.CodePoint.encodeFromString(str, readIndex);
					if(charCode <=0x7F){
						outputArray[writeIndex++]=charCode;
					}
					else if(charCode <=0x7FF){
						outputArray[writeIndex++]=0xC0 |(charCode >>> 6);
						outputArray[writeIndex++]=0x80 |(charCode & 63);
					}
					else if(charCode <=0xFFFF){
						outputArray[writeIndex++]=0xE0 |(charCode >>> 12);
						outputArray[writeIndex++]=0x80 |((charCode >>> 6)& 63);
						outputArray[writeIndex++]=0x80 |(charCode & 63);
					}
					else if(charCode <=0x10FFFF){
						outputArray[writeIndex++]=0xF0 |(charCode >>> 18);
						outputArray[writeIndex++]=0x80 |((charCode >>> 12)& 63);
						outputArray[writeIndex++]=0x80 |((charCode >>> 6)& 63);
						outputArray[writeIndex++]=0x80 |(charCode & 63);
						readIndex++;
					}
					else
						throw new Error("Invalid UTF-16 string: Encountered a character unsupported by UTF-8/16(RFC 3629)");
				}
				return outputArray.subarray(0, writeIndex);
			};
			UTF8.decodeWithJS=function(utf8Bytes, startOffset, endOffset){
				if(startOffset===void 0){ startOffset=0; }
				if(!utf8Bytes||utf8Bytes.length==0)
					return "";
				if(endOffset===undefined)
					endOffset=utf8Bytes.length;
				var output=new LZUTF8.StringBuilder();
				var outputCodePoint;
				var leadByte;
				for(var readIndex=startOffset, length_6=endOffset; readIndex < length_6;){
					leadByte=utf8Bytes[readIndex];
					if((leadByte >>> 7)===0){
						outputCodePoint=leadByte;
						readIndex +=1;
					}
					else if((leadByte >>> 5)===6){
						if(readIndex + 1 >=endOffset)
							throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " + readIndex);
						outputCodePoint=((leadByte & 31)<< 6)|(utf8Bytes[readIndex + 1] & 63);
						readIndex +=2;
					}
					else if((leadByte >>> 4)===14){
						if(readIndex + 2 >=endOffset)
							throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " + readIndex);
						outputCodePoint=((leadByte & 15)<< 12)|((utf8Bytes[readIndex + 1] & 63)<< 6)|(utf8Bytes[readIndex + 2] & 63);
						readIndex +=3;
					}
					else if((leadByte >>> 3)===30){
						if(readIndex + 3 >=endOffset)
							throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " + readIndex);
						outputCodePoint=((leadByte & 7)<< 18)|((utf8Bytes[readIndex + 1] & 63)<< 12)|((utf8Bytes[readIndex + 2] & 63)<< 6)|(utf8Bytes[readIndex + 3] & 63);
						readIndex +=4;
					}
					else
						throw new Error("Invalid UTF-8 stream: An invalid lead byte value encountered at position " + readIndex);
					output.appendCodePoint(outputCodePoint);
				}
				return output.getOutputString();
			};
			UTF8.createNativeTextEncoderAndDecoderIfAvailable=function(){
				if(nativeTextEncoder)
					return true;
				if(typeof TextEncoder=="function"){
					nativeTextEncoder=new TextEncoder("utf-8");
					nativeTextDecoder=new TextDecoder("utf-8");
					return true;
				}
				else
					return false;
			};
		})(UTF8=Encoding.UTF8||(Encoding.UTF8={}));
	})(Encoding=LZUTF8.Encoding||(LZUTF8.Encoding={}));
})(LZUTF8||(LZUTF8={}));
var LZUTF8;
(function(LZUTF8){
	function compress(input, options){
		if(options===void 0){ options={}; }
		if(input==null)
			throw new TypeError("compress: undefined or null input received");
		var inputEncoding=LZUTF8.CompressionCommon.detectCompressionSourceEncoding(input);
		options=LZUTF8.ObjectTools.override({ inputEncoding: inputEncoding, outputEncoding: "ByteArray" }, options);
		var compressor=new LZUTF8.Compressor();
		var compressedBytes=compressor.compressBlock(input);
		return LZUTF8.CompressionCommon.encodeCompressedBytes(compressedBytes, options.outputEncoding);
	}
	LZUTF8.compress=compress;
	function decompress(input, options){
		if(options===void 0){ options={}; }
		if(input==null)
			throw new TypeError("decompress: undefined or null input received");
		options=LZUTF8.ObjectTools.override({ inputEncoding: "ByteArray", outputEncoding: "String" }, options);
		var inputBytes=LZUTF8.CompressionCommon.decodeCompressedBytes(input, options.inputEncoding);
		var decompressor=new LZUTF8.Decompressor();
		var decompressedBytes=decompressor.decompressBlock(inputBytes);
		return LZUTF8.CompressionCommon.encodeDecompressedBytes(decompressedBytes, options.outputEncoding);
	}
	LZUTF8.decompress=decompress;
	function encodeUTF8(str){
		return LZUTF8.Encoding.UTF8.encode(str);
	}
	LZUTF8.encodeUTF8=encodeUTF8;
	function decodeUTF8(input){
		return LZUTF8.Encoding.UTF8.decode(input);
	}
	LZUTF8.decodeUTF8=decodeUTF8;
	function encodeBinaryString(input){
		return LZUTF8.Encoding.BinaryString.encode(input);
	}
	LZUTF8.encodeBinaryString=encodeBinaryString;
	function decodeBinaryString(str){
		return LZUTF8.Encoding.BinaryString.decode(str);
	}
	LZUTF8.decodeBinaryString=decodeBinaryString;
	function encodeStorageBinaryString(input){
		return LZUTF8.Encoding.StorageBinaryString.encode(input);
	}
	LZUTF8.encodeStorageBinaryString=encodeStorageBinaryString;
	function decodeStorageBinaryString(str){
		return LZUTF8.Encoding.StorageBinaryString.decode(str);
	}
	LZUTF8.decodeStorageBinaryString=decodeStorageBinaryString;
})(LZUTF8||(LZUTF8={}));
