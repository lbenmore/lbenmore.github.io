import ImageBlender from "./imageBlender.js";

((win, doc) => {
    const _ = (selector) => doc.querySelector(selector);
    const on = 'addEventListener';

    function onButtonDownloadClick(imageBlender) {
        const a = document.createElement('a');
        a.setAttribute('download', 'output.png');
        a.setAttribute('href', imageBlender.getCanvasDataUrl());

        a.click();
    }

    function attachBlenderEvents(imageBlender) {
        _('.output__button--download')[on]('click', onButtonDownloadClick.bind(null, imageBlender));
    }

    function populateControls(imageBlender) {
        const { compositeSelect, filterList } = imageBlender.controls.elements;

        _('.controls__label--select').appendChild(compositeSelect);
        _('.controls__filter').appendChild(filterList);
    }

    async function initImageBlender(file) {
        const imageBlender = new ImageBlender({ file });

        await imageBlender.init();

        populateControls(imageBlender);
        attachBlenderEvents(imageBlender);

        _('.input').classList.add('hidden');
        _('.output').classList.remove('hidden');
        _('.output__canvas').appendChild(imageBlender.canvas.canvas);
    }

    function onFileInputDragOver(evt) {
        evt.preventDefault();
        _('.input__label').classList.add('active');
    }

    function onFileInputDragLeave(evt) {
        evt.preventDefault();
        _('.input__label').classList.remove('active');
    }

    function onFileInputDrop(evt) {
        evt.preventDefault();

        const { files } = evt.dataTransfer;
        const [file] = files;

        initImageBlender(file);
        _('.input__label').classList.remove('active');
    }

    async function onFileInput(evt) {
        const { files } = evt.target;
        const [file] = files;

        initImageBlender(file);
    }

    function onWindowResize() {
        setCssVariables();
    }

    function setCssVariables() {
        doc.documentElement.style.setProperty('--vh', `${win.innerHeight / 100}px`);
    }

    function attachEvents() {
        win[on]('resize', onWindowResize);
        _('.input__input')[on]('change', onFileInput);
        _('.input__label')[on]('dragover', onFileInputDragOver);
        _('.input__label')[on]('dragleave', onFileInputDragLeave);
        _('.input__label')[on]('drop', onFileInputDrop);
    }

    function initFns() {
        setCssVariables();
        attachEvents();
    }

    doc.readyState === 'complete'
        ? initFns()
        : doc.addEventListener('readystatechange', () => (doc.readyState === 'complete' && initFns()));
})(window, window.document);