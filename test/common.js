// import 

var app = new Vue ({

	el: "#container",

	data: {
		participants: [],
		keys: [],
		count: 0
	},

	methods: {

		// Распределение ресурсов
		resourceAllocation: function() {

			var arrLenght = this.participants.length;
			
			// Этот массив будем наполнять долями
			var shares = [];

			// Создаём массив с долями
			for(i = 0; i < arrLenght; i++) {
				var share = +this.participants[i].share;
				shares.push(share)
			}
			
			// Сумма долей
			var summ = 0;
			for(j = 0; j < arrLenght; j++) {
				summ = summ + shares[j]
			}

			// Высчитываем акции
			var actions = [];
			for(k = 0; k < arrLenght; k++) {
				var action = this.participants[k].share * 1000 / summ;
				action = Math.round(action);
				actions.push(action)
			}

			for(kk = 0; kk < arrLenght; kk++) {
				this.participants[kk].actions = actions[kk]
			}

		},

		// Распределение статусов
		distributionOfStatus: function() {

			var arrLenght = this.participants.length;

			// Обнуляем, если это надо
			for(i = 0; i < arrLenght; i++) {
				this.participants[i].status = null;
			}

			// Пустые переменные для ролей наших участников
			var arr = []
			var bank = null;
			var borrowers = [];
			var nonBorrowers = [];

			// Наполняем наш вспомогательный массив
			for(l = 0; l < arrLenght; l++) {
				arr[l] = l + 1;
			}

			// Решаем какой участнико будет в роли банка
			for (var k = 0; k < 1; k++) {
				bank = this.randomInteger(1, arrLenght)

				if (bank == 0) { k--; continue }
				arr.splice(bank - 1, 1)
				this.participants[bank-1].status = "Банк"

			}

			// Решаем кто будет заёмщиком
			for(j = 0; j < 4; j++) {

				// Случайное число для заёмщика
				var randomBorrower = this.randomInteger(1, arr.length);

				borrowers[j] = arr[randomBorrower];
				arr.splice(randomBorrower, 1)
				if (borrowers[j] == 0 || borrowers[j] == undefined) { j--; continue }
				this.participants[borrowers[j]-1].status = "Заёмщик"
			
			}

			// Все остальные - не заёмщики
			var nonBorrowers = arr;

			for(m = 0; m < 4; m++) {
				this.participants[nonBorrowers[m]-1].status = "Не заёмщик"
			}

			// console.log("Банкир: " + bank)
			// console.log("Заёмщики: " + borrowers)
			// console.log("Не заёмщики: " + nonBorrowers)

			// Обнуляем визуальное отображение игрока
			for(n=0;n<arrLenght;n++) {
				this.participants[n].playerJS = false;
			}


		},

		// Выбираем игрока
		choicePlaer: function () {
			var arrLenght = this.participants.length;
			var nonBorrowers = [];
			
			// Интересуемся кто у нас не заёмщик
			for(i = 0; i < arrLenght; i++) {

				if (this.participants[i].status == "Не заёмщик") {
					nonBorrowers.push(i+1)
				}

			}

			// Выбираем среди них одного
			for(j = 0; j<1; j++) {
				var random = this.randomInteger(1, nonBorrowers.length+1);
				randomNonBorrower = nonBorrowers[random]
				
				if (random == undefined || randomNonBorrower == undefined) {
					j--
					continue
				}

			}

			for(k=0;k<arrLenght;k++) {
				this.participants[k].playerJS = false
			}
			
			// Меняем его статус
			this.participants[randomNonBorrower-1].playerJS = true;

			// Отключаем соответствующую кнопку
			this.keys[randomNonBorrower-1].disabledJS = true;

			// return randomNonBorrower

		},

		// Функция, обеспечивающая равную вероятность попадения числа
		// из заданного диапазона
		randomInteger: function (min, max) {
			min = min - 0.5;
			max = max + 0.5;

			// Проверить работоспособность кода можно постепенно увеличивая
			// значение этой переменной
			var randomMinMaxDifference = max - min,
					randomNonInteger = randomMinMaxDifference + min,
					randomValue = Math.random(),
					randomValueRange = randomValue * randomNonInteger,
					randomValueRangeRound = Math.round(randomValueRange);

			return randomValueRangeRound;
		},

		// Обнуляем и обновляем некоторые данные
		allNull: function() {

			var arrLenght = this.participants.length;
			
			for(i = 0; i < arrLenght; i++) {
				this.participants[i].share = Math.random();
				this.participants[i].actions = null;
				this.participants[i].wantActions = this.randomInteger(0, 100);
				this.participants[i].at = null;
				this.participants[i].pretender = null;
				this.participants[i].purchase = [];

			}

			this.resourceAllocation();
			this.want();
			this.deal();
			this.purchase();

			var count = this.count + 1;
			this.count = count;
			
		},

		// Убираем банкротов
		deactivate: function() {

			var count = this.count;
			var period = count%3;
			var toEndYear = 3 - period;

			console.log("До конца года осталось " + toEndYear)
			console.log(period)

			// Когда проходит год
			if (count > 0) {
				
				var arrLenght = this.participants.length;
				// Проверяем есть ли у нас должники
				for(i = 0; i < arrLenght; i++) {
					var actions = this.participants[i].actions;

					if (actions < 0) {
						// Удаляем из массива
						// this.participants.splice(i, 1)
						// i = i - 1;
						// arrLenght = arrLenght - 1;
						this.participants[i].opacityJS = true;
						this.keys[i].disabledJS = true;
						continue
					}
				}
			}
		},

		// Выбор участников для сделки
		wantLight: function() {

			// Длинна массива
			var arrLenght = this.participants.length;
			// Массив с числами, соответствующими участникам
			var arr = [];
			// Между какими участниками в дальгейшем будут сделки
			var arrWantLight = [];

			if (arrLenght < 4) {
				console.log("Победили участники ")

				for(k = 0; k < this.participants.length; k++) {
					console.log(this.participants[k].number)
				}

			} else {

				// Наполняем массив
				for(i = 0; i < arrLenght; i++) {
					if (this.participants[i].opacityJS == false) {
					// if (this.participants[i].opacityJS == true) {
						// Код в строке ниже сильно подводил
						// arr[i] = this.participants[i].number
						arr.push(this.participants[i].number)
						
					}
				}
				console.log("Наши участники: " + arr)

				// Решаем между кем будет сделка
				for(j = 0; j < 4; j++) {

					var random = this.randomInteger(0, arrLenght) - 1;
					// var random = this.randomInteger(0, arr.lenght) - 1;

					if (random == undefined || random < 0 || arrWantLight == undefined ||
						arr[random] == undefined) {
						j = j - 1;
						continue
					}

					arrWantLight[j] = arr[random];
					arr.splice(random, 1);
					arrLenght = arrLenght - 1;

				}

				// console.log(arrWantLight)
				return arrWantLight
				
			}

		},

		// Обмен (лайт версия)
		exchange: function() {

			var arrLenght = this.participants.length;

			if(arrLenght > 3) {

				var arrWantLight = this.wantLight();

				// Принимают и отдают ресурсы
				var setParticipant = [arrWantLight[0], arrWantLight[1]];
				var getParticipant = [arrWantLight[2], arrWantLight[3]];

				// console.log("Принимают ресурсы: " + setParticipant)
				// console.log("Отдают ресурсы: " + getParticipant)

				/*console.log("Участник № " + setParticipant[0] + " принимает ресурсы от " + 
					"учстника №" + getParticipant[0] + "\n" + 
					"Участник № " + setParticipant[1] + " принимает ресурсы от " + 
					"учстника №" + getParticipant[1])*/

				// Ресурсы принимающих и отдающих до сделки, ...
				var setResours = [this.participants[setParticipant[0] - 1].actions,
				this.participants[setParticipant[1] - 1].actions];
				var getResours = [this.participants[getParticipant[0] - 1].actions,
				this.participants[getParticipant[1] - 1].actions];
				var setResoursWant = [this.participants[setParticipant[0] - 1].wantActions,
				this.participants[setParticipant[1] - 1].wantActions]
				// console.log("Принимающие имеют ресурсы: " + setResours)
				// console.log("Отдающие имеют ресурсы:" + getResours)
				// console.log("Разница: " + setResoursWant)

				// ... и после сделки
				var setResoursAfter = [];
				var getResoursAfter = [];

				for(k = 0; k < 2; k++) {
					setResoursAfter[k] = setResours[k] + setResoursWant[k];
					getResoursAfter[k] = getResours[k] - setResoursWant[k]
				}

				for(l = 0; l < 2; l++) {
					this.participants[setParticipant[l] - 1].actions = setResoursAfter[l]
					this.participants[getParticipant[l] - 1].actions = getResoursAfter[l]
				}

				/*console.log("Состоится 2 сделки" + "\n" + 
					"1) Участник №" + setParticipant[0] + ", владеющий " + setResours[0] + 
					" ресурсами, берёт " + setResoursWant[0] + " ресурсов у участника №" +
					getParticipant[0] + ", который изначально владеет " + getResours[0] +
					" ресурсами. После сделки их баланс " + setResoursAfter[0] + " и " +
					getResoursAfter[0] + "\n" +
					"2) Участник №" + setParticipant[1] + ", владеющий " + setResours[1] + 
					" ресурсами, берёт " + setResoursWant[1] + " ресурсов у участника №" +
					getParticipant[1] + ", который изначально владеет " + getResours[1] +
					" ресурсами. После сделки их баланс " + setResoursAfter[1] + " и " +
					getResoursAfter[1])*/

				this.count = this.count + 1;

				for(m=0;m<arrLenght;m++) {
					this.participants[m].wantActions = this.randomInteger(0, 200)
				}

				
			} else {
				this.wantLight();
			}

		},

		// Определяем кто является нашим персонажем
		whoIsOurPersonage: function() {
			var personage = undefined;

			for(i=0;i<this.participants.length;i++) {
				if (this.participants[i].playerJS == true) {
					personage = i+1
				}
			}
			return personage

		},

		exchangeTogether: function(indexKey) {

			// Номер персонажа
			var personage = this.whoIsOurPersonage();
			// Объём ресурсов персонажа до сделки
			var actionsPersonageBefore = this.participants[personage-1].actions;
			// Объём ресурсов, на которые он претендует
			var wantActionsPersonage = this.participants[personage-1].wantActions;
			// Объём ресурсов у донатора до сделки
			var actionsDonatorBefore = this.participants[indexKey].actions
			
			// Проводим рассчёты и устанавливаем новые значения
			// Объём ресурсов у персонажа после сделки
			var actionsPersonageAfter = actionsPersonageBefore + wantActionsPersonage;
			// Объём ресурсов у донатора после сделки
			var actionsDonatorAfter = actionsDonatorBefore - wantActionsPersonage;
			this.participants[personage-1].actions = actionsPersonageAfter;
			this.participants[indexKey].actions = actionsDonatorAfter;

			/*Проводим рассчёты для всех остальных*/

			var arrLenght = this.participants.length;
			var arr = [];

			for(i=0;i<arrLenght;i++) {
				arr[i] = i+1;
			}

			// Убираем из массива всех, кто сделку уже осуществил
			arr.splice(personage-1,1);
			if (personage > (indexKey+1)) {
				arr.splice(indexKey, 1);
			} else {
				arr.splice(indexKey - 1, 1);
			}

			arrLenght = arrLenght - 2;

			// Между какими участниками в дальгейшем будут сделки
			var arrWant = [];

			if (arrLenght == 7 || arrLenght == 6) {

				for(j = 0; j < 6; j++) {

					var random = this.randomInteger(0, arrLenght) - 1;

					if (random == undefined || random < 0 || arrWant == undefined ||
					arr[random] == undefined) {
						j = j - 1;
						continue
					}

					arrWant[j] = arr[random];
					arr.splice(random, 1);
					arrLenght = arrLenght - 1;

				}

				// Принимают и отдают ресурсы
				var setParticipant = [arrWant[0], arrWant[1], arrWant[2]];
				var getParticipant = [arrWant[3], arrWant[4], arrWant[5]];

				console.log("Принимают ресурсы: " + setParticipant)
				console.log("Отдают ресурсы: " + getParticipant)

				/*console.log("Участник № " + setParticipant[0] + " принимает ресурсы от " + 
					"учстника №" + getParticipant[0] + "\n" + 
					"Участник № " + setParticipant[1] + " принимает ресурсы от " + 
					"учстника №" + getParticipant[1])*/

				// Ресурсы принимающих и отдающих до сделки, ...
				var setResours = [this.participants[setParticipant[0] - 1].actions,
				this.participants[setParticipant[1] - 1].actions,
				this.participants[setParticipant[2] - 1].actions];
				var getResours = [this.participants[getParticipant[0] - 1].actions,
				this.participants[getParticipant[1] - 1].actions,
				this.participants[getParticipant[2] - 1].actions];
				var setResoursWant = [this.participants[setParticipant[0] - 1].wantActions,
				this.participants[setParticipant[1] - 1].wantActions,
				this.participants[setParticipant[2] - 1].wantActions]
				console.log("Принимающие имеют ресурсы: " + setResours)
				console.log("Отдающие имеют ресурсы:" + getResours)
				console.log("Разница: " + setResoursWant)

				// ... и после сделки
				var setResoursAfter = [];
				var getResoursAfter = [];

				for(k = 0; k < 3; k++) {
					setResoursAfter[k] = setResours[k] + setResoursWant[k];
					getResoursAfter[k] = getResours[k] - setResoursWant[k]
				}

				for(l = 0; l < 3; l++) {
					this.participants[setParticipant[l] - 1].actions = setResoursAfter[l]
					this.participants[getParticipant[l] - 1].actions = getResoursAfter[l]
				}

				console.log("Состоится 3 сделки" + "\n" +  "\n" +
					"1) Участник №" + setParticipant[0] + ", владеющий " + setResours[0] + 
					" ресурсами, берёт " + setResoursWant[0] + " ресурсов у участника №" +
					getParticipant[0] + ", который изначально владеет " + getResours[0] +
					" ресурсами. После сделки их баланс " + setResoursAfter[0] + " и " +
					getResoursAfter[0] + "\n" + "\n" +
					"2) Участник №" + setParticipant[1] + ", владеющий " + setResours[1] + 
					" ресурсами, берёт " + setResoursWant[1] + " ресурсов у участника №" +
					getParticipant[1] + ", который изначально владеет " + getResours[1] +
					" ресурсами. После сделки их баланс " + setResoursAfter[1] + " и " +
					getResoursAfter[1] + "\n" +  "\n" +
					"3) Участник №" + setParticipant[2] + ", владеющий " + setResours[2] + 
					" ресурсами, берёт " + setResoursWant[2] + " ресурсов у участника №" +
					getParticipant[2] + ", который изначально владеет " + getResours[2] +
					" ресурсами. После сделки их баланс " + setResoursAfter[2] + " и " +
					getResoursAfter[2])

				for(m = 0; m < this.participants.length; m++) {
					this.participants[m].wantActions = this.randomInteger(0, 200)
				}

				// Убираем банкротов
				for(i = 0; i < this.participants.length; i++) {
					var actions = this.participants[i].actions;

					if (actions < 0) {
						// Удаляем из массива
						arr.splice(i, 1)
						i = i - 1;
						// arrLenght = arrLenght - 1;
						this.participants[i].opacityJS = true;
						this.keys[i].disabledJS = true;
						continue
					}
				}

				console.log(arr)


			} 

			/*else if (arrLenght == 5 || arrLenght == 4) {

			} else if (arrLenght == 3 || arrLenght == 2) {

			}*/

			this.count = this.count + 1;

		}

	},

	mounted: function() {

		// Наполняем наш наш массив участниками
		for(i = 1; i < 10; i++) {
			this.participants.push({
				number: i,
				status: null,
				share: Math.random(),
				actions: null,
				wantActions: this.randomInteger(0, 200),
				at: null,
				pretender: null,
				purchase: [],
				playerJS: false,
				opacityJS: false,
				disabled: false
			})

			this.keys.push({
				number: i,
				disabledJS: false
			})

		}
		
		this.resourceAllocation();
		this.distributionOfStatus();
		this.choicePlaer();

	}

})