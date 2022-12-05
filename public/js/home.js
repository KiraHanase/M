let i = 1;

setInterval(() => {
    if (i == 2) {
        i = 1;
    } else {
        i++;
    }

    $("#home-feature").attr("src", `home-feature-${i}.PNG`);
}, 7000);

function home_feature_btn() {
    if (i == 2) {
        i = 1;
    } else {
        i++;
    }
    $("#home-feature").attr("src", `home-feature-${i}.PNG`);
}