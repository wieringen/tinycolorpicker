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

    it('should have a chainable constructor', function() {
        $('#colorPicker').tinycolorpicker().addClass('testing');

        expect($('#colorPicker').hasClass('testing')).to.equal(true);
    });

    it('should have a accessible instance', function() {
        var instance = $('#colorPicker').tinycolorpicker().data('plugin_tinycolorpicker');

        expect(instance).to.be.a('object');
        expect(instance._name).to.equal('tinycolorpicker');
    });
});
