export default class ImageBlenderControls {
    constructor(onUpdate) {
        this.onUpdate = onUpdate;

        this.filter = '';
        this.globalCompositeOperation = '';

        this.compositeOperations = [
            "none",
            "darken",
            "multiply",
            "color-burn",
            "lighten",
            "screen",
            "color-dodge",
            "lighter",
            "overlay",
            "soft-light",
            "hard-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity",
        ];

        this.filters = [
            {
                name: "blur",
                min: 0,
                max: 20,
                step: 0.1,
                value: 0,
                unit: 'px',
            },
            {
                name: "brightness",
                min: 0,
                max: 20,
                step: 0.1,
                value: 1,
            },
            {
                name: "contrast",
                min: 0,
                max: 20,
                step: 0.1,
                value: 1,
            },
            {
                name: "grayscale",
                min: 0,
                max: 1,
                step: 0.1,
                value: 0,
            },
            {
                name: "hue-rotate",
                min: 0,
                max: 360,
                step: 1,
                value: 0,
                unit: 'deg',
            },
            {
                name: "invert",
                min: 0,
                max: 1,
                step: 0.1,
                value: 0,
            },
            {
                name: "opacity",
                min: 0,
                max: 1,
                step: 0.1,
                value: 1,
            },
            {
                name: "saturate",
                min: 0,
                max: 20,
                step: 0.1,
                value: 1,
            },
        ];

        this.elements = this.generateElements();

        this.attachListeners();
    }

    updateGlobalCompositeOperation(evt) {
        const { value } = evt.target;
        this.globalCompositeOperation = value !== 'none' ? value : '';
        this.onUpdate();
    }

    updateFilter() {
        let filter = '';

        this.elements.filterList.details.forEach((detail) => {
            if (detail.hasAttribute('open')) {
                filter += `${detail.range.dataset.name}(${detail.range.value}${detail.range.dataset.unit || ''}) `;
            }
        });

        this.filter = filter;

        this.onUpdate();
    }

    attachListeners() {
        this.elements.compositeSelect.addEventListener('change', this.updateGlobalCompositeOperation.bind(this));

        this.elements.filterList.details.forEach((detail) => {
            detail.addEventListener('toggle', this.updateFilter.bind(this));
            detail.range.addEventListener('input', this.updateFilter.bind(this));
        })
    }

    formatLabel(string) {
        return (string.slice(0, 1).toUpperCase() + string.slice(1))
            .replace(/-([a-z])/g, (...args) => (` ${args[1].toUpperCase()}`));
    }

    generateFilterList() {
        const container = document.createElement('div');
        container.details = [];

        for (const filter of this.filters) {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            const range = document.createElement('input');

            summary.textContent = this.formatLabel(filter.name);

            range.dataset.name = filter.name;
            if (filter.unit) range.dataset.unit = filter.unit;

            range.setAttribute('type', 'range');
            range.setAttribute('min', filter.min);
            range.setAttribute('max', filter.max);
            range.setAttribute('step', filter.step);
            range.setAttribute('value', filter.value);

            details.summary = summary;
            details.range = range;
            container.details.push(details);

            details.appendChild(summary);
            details.appendChild(range);

            container.appendChild(details);
        }

        return container;
    }

    generateCompositeSelect() {
        const select = document.createElement('select');

        for (const compositeOperation of this.compositeOperations) {
            const option = document.createElement('option');
            option.setAttribute('value', compositeOperation);
            option.textContent = this.formatLabel(compositeOperation);
            select.appendChild(option);
        }

        return select;
    }

    generateElements() {
        const compositeSelect = this.generateCompositeSelect();
        const filterList = this.generateFilterList();
        return {
            compositeSelect,
            filterList,
        };
    }
}