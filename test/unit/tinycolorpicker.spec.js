describe('A single Tinycolorpicker', function() {
    before(function () {
        document.head.innerHTML = __html__['test/fixtures/tinycolorpicker-css.html'];
    });

    beforeEach(function () {
        document.body.innerHTML = __html__['test/fixtures/tinycolorpicker.html'];
    });

    afterEach(function () {
        document.body.innerHTML = '';
    });
});
