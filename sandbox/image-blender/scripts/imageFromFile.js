const imageFromFile = (file) => {
    const reader = new FileReader();
    const img = new Image();

    return new Promise((resolve) => {
        img.addEventListener('load', () => resolve(img));
        reader.addEventListener('load', () => (img.src = reader.result));
        reader.readAsDataURL(file);
    })
};

export default imageFromFile;