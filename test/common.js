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

			console.log("Банкир: " + bank)
			console.log("Заёмщики: " + borrowers)
			console.log("Не заёмщики: " + nonBorrowers)

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
				this.participants[i].wantResourse = this.randomInteger(0, 100);
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
				var setResoursWant = [this.participants[setParticipant[0] - 1].wantResourse,
				this.participants[setParticipant[1] - 1].wantResourse]
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
					this.participants[m].wantResourse = this.randomInteger(0, 200)
				}

				
			} else {
				this.wantLight();
			}

		},

		ourExchange: function(indexKey) {
			// indexKey = indexKey + 1;

			var playerActionsBefore = this.participants[indexKey].actions;
			console.log("До сделки у участника №" + (indexKey+1) + " " +
				playerActionsBefore + " ресурсов")

			// Находим нашего персонажа и интересуемся сколько у него ресурсов
			for(i=0;i<9;i++) {
				if (this.participants[i].playerJS == true) {
					var numberPlayer = i;
					var playerActionsBefore = this.participants[i].actions
				}
			}

			console.log(a)

			var playerActionsAfter = playerActionsBefore + a;
			console.log(playerActionsAfter)

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
				wantResourse: this.randomInteger(0, 200),
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