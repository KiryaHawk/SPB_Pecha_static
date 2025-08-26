ymaps.ready(function () {

    fetch('open.json')
        .then(response => response.json())
        .then(obj => {

            console.log(obj);
            const searchControls = new ymaps.control.SearchControl({
                options: {
                    float: 'right',
                    noPlacemark: true
                }
            });

            // Инициализация карты
            const myMap = new ymaps.Map("map", {
                center: [59.9343, 30.3351], // Центр Санкт-Петербурга
                zoom: 10, // Уровень зума
                controls: [searchControls]
            });

            // Удаление ненужных элементов управления
            const removeControls = [
                'geolocationControl',
                'trafficControl',
                'fullscreenControl',
                'zoomControl',
                'rulerControl',
                'typeSelector'
            ];

            const clearTheMap = myMap => {
                removeControls.forEach(controls => myMap.controls.remove(controls));
            };

            clearTheMap(myMap);

            // Создание ObjectManager для кластеризации
            const objectManager = new ymaps.ObjectManager({
                clusterize: true,
                clusterIconLayout: "default#pieChart"
            });

            // Массив координат для расчета границ (оставляем, но не используем)
            let minLatitude = Infinity, maxLatitude = -Infinity;
            let minLongitude = Infinity, maxLongitude = -Infinity;

            // Обрабатываем объекты и инвертируем координаты
            obj.features.forEach(feature => {
                if (feature.geometry && feature.geometry.coordinates) {
                    const [longitude, latitude] = feature.geometry.coordinates;
                    feature.geometry.coordinates = [latitude, longitude];  // Меняем долготу и широту местами

                    // Определяем минимальные и максимальные координаты
                    minLatitude = Math.min(minLatitude, latitude);
                    maxLatitude = Math.max(maxLatitude, latitude);
                    minLongitude = Math.min(minLongitude, longitude);
                    maxLongitude = Math.max(maxLongitude, longitude);
                }
            });

            // Очистка данных в ObjectManager перед добавлением новых объектов
            objectManager.removeAll();

            // Добавляем все объекты в objectManager
            objectManager.add(obj);

            // Добавляем objectManager на карту
            myMap.geoObjects.add(objectManager);

            // 👉 Блок с setBounds закомментирован, центр всегда СПб
            /*
            if (minLatitude !== Infinity && maxLatitude !== -Infinity &&
                minLongitude !== Infinity && maxLongitude !== -Infinity) {
                const bounds = [
                    [minLatitude, minLongitude],  // Низшая точка
                    [maxLatitude, maxLongitude]   // Высшая точка
                ];
                myMap.setBounds(bounds, {
                    checkZoomRange: true
                });
            }
            */
        });
});
