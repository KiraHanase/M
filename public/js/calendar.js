function position() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(result => {
      resolve(result);
      reject(`Server might be down or your connection is bad`);
    })
  })
}

async function get_location() {
  const coordinate = await position();
  const Latitude = coordinate.coords.latitude;
  const Longitude = coordinate.coords.longitude;

  async function get_position() {
    return new Promise((resolve, reject) => {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${Latitude}&longitude=${Longitude}&localityLanguage=id&key=bdc_18395b1c6627454eb37a836a13a477bf`;
      $.getJSON(url, function (result) {
        resolve(result);
        reject(`Server might be down or your connection is bad`);
      });
    })
  }

  const location = await get_position();
  return location;
}

async function detect_get_id_city() {
  const city = await get_location().then((location) => {
    return location.city;
  });

  async function process_get_id() {
    return new Promise((resolve, reject) => {
      const url = `https://api.myquran.com/v1/sholat/kota/cari/${city}`;
      $.getJSON(url, function (result) {
        let data_id;
        result.data.forEach(element => {
          if (element.lokasi == `KOTA ${city.toUpperCase()}`) {
            data_id = element;
          }
        });
        resolve(data_id);
        reject(`Server might be down or your connection is bad`);
      });
    })
  }

  const id_city = await process_get_id();
  sessionStorage.setItem("idCity", id_city.id);
  sessionStorage.setItem("nameCity", id_city.lokasi)
}

async function get_id_city(city) {
  async function process_get_id() {
    return new Promise((resolve, reject) => {
      const url = `https://api.myquran.com/v1/sholat/kota/cari/${city}`;
      $.getJSON(url, function (result) {
        let data_id;
        for (let x = 0; x < result.data.length; x++) {
          if (result.data[x].lokasi == `${$('#user-city').val()}`) {
            data_id = result.data[x].id;
          }
        }
        resolve(data_id);
        reject(`Server might be down or your connection is bad`);
      });
    })
  }

  const id_city = await process_get_id();
  return id_city;
}

async function get_daily_pray_time(id_city, year, month, date) {
  async function process_get_daily_pray_time() {
    return new Promise((resolve, reject) => {
      const url = `https://api.myquran.com/v1/sholat/jadwal/${id_city}/${year}/${month}/${date}`;
      $.getJSON(url, function (result) {
        resolve(result);
        reject(`Server might be down or your connection is bad`);
      });
    })
  }

  const result = await process_get_daily_pray_time();
  return result;
}

async function get_monthly_pray_time(id_city, year, month) {
  async function process_get_monthly_pray_time() {
    return new Promise((resolve, reject) => {
      const url = `https://api.myquran.com/v1/sholat/jadwal/${id_city}/${year}/${month}/`;
      $.getJSON(url, function (result) {
        resolve(result);
        reject(`Server might be down or your connection is bad`);
      });
    })
  }

  const result = await process_get_monthly_pray_time();
  return result;
}

async function detect_pray_time_daily() {
  const id_of_city = sessionStorage.getItem("idCity")
  const time = new Date();
  const year = time.getUTCFullYear();
  const month = time.getUTCMonth() + 1;
  const date = time.getUTCDate();
  const result = await get_daily_pray_time(id_of_city, year, month, date);

  $('#subuh-time-today').html(result.data.jadwal.subuh);
  $('#terbit-time-today').html(result.data.jadwal.terbit);
  $('#dzuhur-time-today').html(result.data.jadwal.dzuhur);
  $('#ashar-time-today').html(result.data.jadwal.ashar);
  $('#maghrib-time-today').html(result.data.jadwal.maghrib);
  $('#isya-time-today').html(result.data.jadwal.isya);
};

async function detect_pray_time_monthly() {
  const id_of_city = sessionStorage.getItem("idCity")
  const time = new Date();
  const year = time.getUTCFullYear();
  const month = time.getUTCMonth() + 1;
  const result = await get_monthly_pray_time(id_of_city, year, month);

  $("#loading").addClass("element-hide");
  $("#month-header").html(`${$("#month-selected").val()} ${$("#year-selected").val()}`);
  result.data.jadwal.forEach(element => {
    $('#monthly-pray-calendar').append(`
        <div class="col-md-4 mt-md-4 monthly-pray-time" style="padding-top: 20px; z-index: -1; padding-bottom: 20px;">
          <div class="card" style="width: 18rem">
            <div class="card-header" id="monthly-date">${element.tanggal}</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                Subuh : <span id="monthly-subuh">${element.subuh}</span>
              </li>
              <li class="list-group-item">
                Terbit : <span id="monthly-terbit">${element.terbit}</span>
              </li>
              <li class="list-group-item">
                Dzuhur : <span id="monthly-dzuhur">${element.dzuhur}</span>
              </li>
              <li class="list-group-item">
                Ashar : <span id="monthly-ashar">${element.ashar}</span>
              </li>
              <li class="list-group-item">
                Maghrib : <span id="monthly-maghrib">${element.maghrib}</span>
              </li>
              <li class="list-group-item">
                Isya : <span id="monthly-isya">${element.isya}</span>
              </li>
            </ul>
          </div>
        </div>
      `)
  })
}; search_city()

async function set_city() {
  $(".cities").html(`${sessionStorage.getItem('nameCity')}`);
  $("#user-city").val(`${sessionStorage.getItem('nameCity')}`);
};

async function search_city() {
  let input = $("#search-input").val();
  async function search_City_Process() {
    return new Promise((resolve, reject) => {
      const url = `https://api.myquran.com/v1/sholat/kota/cari/${input}`;
      $.getJSON(url, function (result) {
        let data = [];
        if (result.data) {
          result.data.forEach((element) => {
            if (element.lokasi.includes("KAB.") == false && element.lokasi.includes(input.toUpperCase())) {
              data.push(element);
            }
          })
        }
        resolve(data);
        reject(`Server might be down or your connection is bad`);
      });
    });
  };

  const results = await search_City_Process();
  return results
};

function set_year() {
  const date = new Date();
  const year = date.getFullYear();
  $("#year-selected").val(year);
};

function set_month() {
  const month_list = ["Januari", "February", "Maret", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "Desember"];
  const date = new Date();
  const month = month_list[date.getUTCMonth()];
  $("#month-selected").val(month);
};

async function month_select(month) {
  $("#month-selected").val(month);
  $(".monthly-pray-time").remove();
  $("#loading").removeClass("element-hide");
  $("#month-header").html(``);
  const city = $('#user-city').val();

  const id_of_city = await get_id_city(city);

  const month_list = ["Januari", "February", "Maret", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "Desember"];
  const year = $("#year-selected").val();
  const month_selected = month_list.indexOf($("#month-selected").val());
  $("#month-header").html(`${$("#month-selected").val()} ${$("#year-selected").val()}`);


  const result = await get_monthly_pray_time(id_of_city, year, month_selected + 1);

  $("#loading").addClass("element-hide");
  result.data.jadwal.forEach(element => {
    $('#monthly-pray-calendar').append(`
        <div class="col-md-4 mt-md-4 monthly-pray-time" style="padding-top: 20px; z-index: -1; padding-bottom: 20px;">
          <div class="card" style="width: 18rem">
            <div class="card-header" id="monthly-date">${element.tanggal}</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                Subuh : <span id="monthly-subuh">${element.subuh}</span>
              </li>
              <li class="list-group-item">
                Terbit : <span id="monthly-terbit">${element.terbit}</span>
              </li>
              <li class="list-group-item">
                Dzuhur : <span id="monthly-dzuhur">${element.dzuhur}</span>
              </li>
              <li class="list-group-item">
                Ashar : <span id="monthly-ashar">${element.ashar}</span>
              </li>
              <li class="list-group-item">
                Maghrib : <span id="monthly-maghrib">${element.maghrib}</span>
              </li>
              <li class="list-group-item">
                Isya : <span id="monthly-isya">${element.isya}</span>
              </li>
            </ul>
          </div>
        </div>
      `);
  });
};

$("#date-pickers").click(function () {
  $("#calendar-back").removeClass("calendar-hide")
  $("#date-picker").toggleClass("calendar-hide");
});

$("#calendar-back").click(function () {
  $("#date-picker").toggleClass("calendar-hide");
  $("#calendar-back").addClass("calendar-hide")
});

$("#search-input").keyup(async function () {
  let input = $("#search-input").val();
  if (input.length >= 2) {
    $("#loading-search").removeClass("element-hide");
    const result = await search_city();
    $(".city-list").remove();
    $("#loading-search").addClass("element-hide");
    for (let x = 0; x < result.length; x++) {
      $(".city-menu").append(`
        <li>
          <a
            class="dropdown-item city-list"
            style="cursor: pointer"
            onclick="city_target('${result[x].id}')"
          >${result[x].lokasi}</a>
        </li>
        `)
    }
  } else if (input.length < 2) {
    $(".city-list").remove();
  }
});

async function get_city_by_id(id) {
  async function process() {
    return new Promise((resolve, reject) => {
      const url = `https://api.myquran.com/v1/sholat/kota/id/${id}`;
      $.getJSON(url, function (result) {
        resolve(result);
        reject(`Server might be down or your connection is bad`);
      });
    })
  }

  const res = await process();
  return res;
}

async function city_target(id_city) {
  const year = $("#year-selected").val();
  $(".monthly-pray-time").remove();
  $(".cities").html("");
  $("#loading").removeClass("element-hide");

  const month_list = ["Januari", "February", "Maret", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "Desember"];
  const month_selected = month_list.indexOf($("#month-selected").val());
  const city = await get_city_by_id(id_city);
  $("#search-input").val(city.data.lokasi);
  $(".cities").html(city.data.lokasi);
  $("#user-city").val(city.data.lokasi);

  // Update Monthly Pray Times

  const result = await get_monthly_pray_time(id_city, year, month_selected + 1);

  $("#loading").addClass("element-hide");
  result.data.jadwal.forEach(element => {
    $('#monthly-pray-calendar').append(`
        <div class="col-md-4 mt-md-4 monthly-pray-time" style="padding-top: 20px; z-index: -1; padding-bottom: 20px;">
          <div class="card" style="width: 18rem">
            <div class="card-header" id="monthly-date">${element.tanggal}</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                Subuh : <span id="monthly-subuh">${element.subuh}</span>
              </li>
              <li class="list-group-item">
                Terbit : <span id="monthly-terbit">${element.terbit}</span>
              </li>
              <li class="list-group-item">
                Dzuhur : <span id="monthly-dzuhur">${element.dzuhur}</span>
              </li>
              <li class="list-group-item">
                Ashar : <span id="monthly-ashar">${element.ashar}</span>
              </li>
              <li class="list-group-item">
                Maghrib : <span id="monthly-maghrib">${element.maghrib}</span>
              </li>
              <li class="list-group-item">
                Isya : <span id="monthly-isya">${element.isya}</span>
              </li>
            </ul>
          </div>
        </div>
      `);
  });

  // update daily-pray-times
  const time = new Date();
  const year_today = time.getUTCFullYear();
  const month_today = time.getUTCMonth() + 1;
  const date = time.getUTCDate();

  const result_today = await get_daily_pray_time(id_city, year_today, month_today, date);

  $('#subuh-time-today').html(result_today.data.jadwal.subuh);
  $('#terbit-time-today').html(result_today.data.jadwal.terbit);
  $('#dzuhur-time-today').html(result_today.data.jadwal.dzuhur);
  $('#ashar-time-today').html(result_today.data.jadwal.ashar);
  $('#maghrib-time-today').html(result_today.data.jadwal.maghrib);
  $('#isya-time-today').html(result_today.data.jadwal.isya);
}

async function year_select(year) {
  $("#year-selected").val(year);
  $(".monthly-pray-time").remove();
  $("#loading").removeClass("element-hide");
  $("#month-header").html(``);
  const city = $('#user-city').val();

  const id_of_city = await get_id_city(city);

  const month_list = ["Januari", "February", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"];
  const year_selected = $("#year-selected").val();
  const month_selected = month_list.indexOf($("#month-selected").val());
  $("#month-header").html(`${$("#month-selected").val()} ${$("#year-selected").val()}`);


  const result = await get_monthly_pray_time(id_of_city, year_selected, month_selected + 1);

  $("#loading").addClass("element-hide");
  result.data.jadwal.forEach(element => {
    $('#monthly-pray-calendar').append(`
        <div class="col-md-4 mt-md-4 monthly-pray-time" style="padding-top: 20px; z-index: -1; padding-bottom: 20px;">
          <div class="card">
            <div class="card-header" id="monthly-date">${element.tanggal}</div>
            <ul class="list-group">
              <li class="list-group-item">
                Subuh : <span id="monthly-subuh">${element.subuh}</span>
              </li>
              <li class="list-group-item">
                Terbit : <span id="monthly-terbit">${element.terbit}</span>
              </li>
              <li class="list-group-item">
                Dzuhur : <span id="monthly-dzuhur">${element.dzuhur}</span>
              </li>
              <li class="list-group-item">
                Ashar : <span id="monthly-ashar">${element.ashar}</span>
              </li>
              <li class="list-group-item">
                Maghrib : <span id="monthly-maghrib">${element.maghrib}</span>
              </li>
              <li class="list-group-item">
                Isya : <span id="monthly-isya">${element.isya}</span>
              </li>
            </ul>
          </div>
        </div>
      `);
  });
}

$(document).ready(() => {
  detect_get_id_city().then(() => {
    set_year();
    set_month();
    detect_pray_time_monthly();
    detect_pray_time_daily();
    set_city();
  })
})