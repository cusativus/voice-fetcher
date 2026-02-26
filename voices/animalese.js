// animalese.js
// (C) 2014 Josh Simmons
// http://github.com/acedio/animalese.js

async function FetchGitHub(file) {
    return await fetch(`https://raw.githubusercontent.com/cusativus/voice-fetcher/refs/heads/main/${file}`);
}
async function RequireAsset(asset) {
    const rawCode = await FetchGitHub(`assets/${asset}`);
    return rawCode
}
async function RequireLibrary(library) {
    return eval(await (await RequireAsset(`libraries/${library}`)).text());
}

var Animalese = async function () {
    const obj = {};
    obj.Animalese = async function (script, shorten, pitch) {
        const { RIFFWAVE } = await RequireLibrary("riffwave.js");
        function shortenWord(str) {
            if (str.length > 1) {
                return str[0] + str[str.length - 1];
            }
            return str;
        }

        var processed_script = script;
        if (shorten) {
            processed_script =
                script.replace(/[^a-z]/gi, ' ').split(' ').map(shortenWord).join('');
        }

        var data = [];

        var sample_freq = 44100;
        var library_letter_secs = 0.15;
        var library_samples_per_letter =
            Math.floor(library_letter_secs * sample_freq);
        var output_letter_secs = 0.075;
        var output_samples_per_letter =
            Math.floor(output_letter_secs * sample_freq);

        for (var c_index = 0; c_index < processed_script.length; c_index++) {
            var c = processed_script.toUpperCase()[c_index];
            if (c >= 'A' && c <= 'Z') {
                var library_letter_start =
                    library_samples_per_letter * (c.charCodeAt(0) - 'A'.charCodeAt(0));

                for (var i = 0; i < output_samples_per_letter; i++) {
                    data[c_index * output_samples_per_letter + i] =
                        this.letter_library[44 + library_letter_start + Math.floor(i * pitch)];
                }
            } else { // non pronouncable character or space
                for (var i = 0; i < output_samples_per_letter; i++) {
                    data[c_index * output_samples_per_letter + i] = 127;
                }
            }
        }

        var wave = new RIFFWAVE();
        wave.header.sampleRate = sample_freq;
        wave.header.numChannels = 1;
        wave.Make(data);

        return wave;
    }

    obj.letter_library = await (await RequireAsset("animalese.wav")).bytes();
    return obj;
}

function sanitizeFilename(filename) {
    // Replace illegal characters with an underscore
    const sanitized = filename.replace(/<\/?[<>:"\/\\|?*\x00-\x1F]/g, '_');

    // Optional: replace spaces with underscores/dashes and convert to lowercase
    return sanitized.replace(/\s/g, '_').toLowerCase();
}

async function Query(text, options) {
    var synth = await Animalese();
    const data = await synth.Animalese(text, false, options.pitch / 100);
    return {
        filepath: `animalese/p${options.pitch}/${sanitizeFilename(text)}.wav`,
        bytes: new Uint8Array(data)
    };
}

function Choices() {
    return {
        pitch: {
            text: `Enter "Pitch" (20-200 Default 100)`,
            type: "number",
            min: 20,
            max: 200
        }
    }
}

console.log("Credits: Josh Simmons\nhttp://github.com/acedio/animalese.js");
module.exports = {Query, Choices}
