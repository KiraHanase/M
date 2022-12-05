async function get_surah() {
    async function process() {
        return new Promise((resolve, reject) => {
            const url = `https://quran-api-makkah.vercel.app/surah`;
            $.getJSON(url, function (result) {
                resolve(result.data);
                reject(`server might be down or your connection is bad`);
            });
        });
        ;
    }

    const result = await process();
    return result;
};

async function get_quran(id_surah) {
    async function process() {
        return new Promise((resolve, reject) => {
            const url = `https://quran-api-makkah.vercel.app/surah/${id_surah}`;
            $.getJSON(url, function (result) {
                resolve(result.data);
                reject(`server might be down or your connection is bad`);
            });
        })
    }

    return result = await process();
}

async function search_get_quran(id_surah) {
    $("#loading").removeClass("element-hide");
    $(".quran-ayat").remove();
    $(".quran-title").html(``);
    const quran_data = await get_quran(id_surah);
    $(quran_data).ready(() => {
        $("#loading").addClass("element-hide");
        $(".quran-title").html(`surat ${quran_data.name.transliteration.id}`);
        const quran_data_ayat = quran_data.verses;
        for (let i = 0; i < quran_data_ayat.length; i++) {
            $("#quran").append(`
            <div class="mt-md-5 quran-ayat">
                <p
                class="card-text text-end pt-md-3 arabic"
                style="padding-top: 1rem; font-size: 3rem; margin-right: 30px;"
                >${quran_data_ayat[i].number.inSurah}.   ${quran_data_ayat[i].text.arab}</p>
                <p
                class="text-center pt-md-3 arabic"
                style="padding-top: 1rem; font-size: 2rem"
                >Artinya : ${quran_data_ayat[i].translation.id}</p>
            </div>`
            )
        }
    });
}

$("#search-surah").keyup(async function () {
    let input_text = $("#search-surah").val();
    let loadingStatus = true
    if ($("#search-surah").val() == "") {
        $("#search-result").addClass("element-hide");
    } else if (input_text[2] == " ") {
        $("#search-result").removeClass("element-hide");
        $(".surah-list").remove();
        $("#loading-result-quran").removeClass("element-hide");
        let container_input = "";
        for (let s = 3; s < input_text.length; s++) {
            container_input += input_text[s];
        }
        const result = await get_surah();
        let surah_name = [];
        let surah_id = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i].name.transliteration.id.toLowerCase().includes(container_input.toLowerCase())) {
                surah_name.push(result[i].name.transliteration.id);
                surah_id.push(result[i].number);
            }
        };
        if (surah_name.length >= 1) {
            $('.search-result-item').remove();
            $("#loading-result-quran").addClass("element-hide");
            for (let a = 0; a < surah_name.length; a++) {
                $('#search-result-list').append(`<h5 class="card search-result-item" style="cursor: pointer" onclick="search_get_quran(${surah_id[a]})">${surah_name[a]}</h5>`);
            }
        } else {
            $("#loading-result-quran").addClass("element-hide");
        }
    } else {
        $("#search-result").removeClass("element-hide");
        $(".surah-list").remove();
        $("#loading-result-quran").removeClass("element-hide");
        const result = await get_surah();
        let surah_name = [];
        let surah_id = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i].name.transliteration.id.toLowerCase().includes($('#search-surah').val().toLowerCase())) {
                surah_name.push(result[i].name.transliteration.id);
                surah_id.push(result[i].number);
            }
        };
        $('.search-result-item').remove();
        $("#loading-result-quran").addClass("element-hide");
        for (let a = 0; a < surah_name.length; a++) {
            $('#search-result-list').append(`<h5 class="card search-result-item" style="cursor: pointer" onclick="search_get_quran(${surah_id[a]})">${surah_name[a]}</h5>`);
        }
    }
});

$(document).ready(() => {

});