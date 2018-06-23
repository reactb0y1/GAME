// import 

var app = new Vue ({

	el: "#container",

	data: {
		participants: [],
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
			var numbers = [];

			for(i = 1; i < arrLenght + 1; i++) {
				numbers.push(i)
			}

			var randomBank = Math.random() * (numbers.length - 1);
			randomBank = Math.round(randomBank) + 1;

			this.participants[randomBank - 1].status = "Банкир";
			numbers.splice(randomBank - 1, 1);

			for(j = 0; j < 4; j++) {
				var randomBorrower = Math.round(Math.random() * (numbers.length - 1)) + 1
				this.participants[randomBorrower - 1].status = "Заёмщик";
				numbers.splice(randomBorrower - 1, 1);

			}

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

		// Обмен
		purchase: function() {

			var arrLenght = this.participants.length;
			console.log("-------")

			for(i = 0; i < arrLenght; i++) {

				// Готов взять ресурсы у этих участников
				var arrPurchase = this.participants[i].purchase;
				// Но сотрудничать будет только с этим
				var seller = 0;
				
				// А если их 0, ...
				if (arrPurchase.length == 0) {
					// console.log("Учасник номер " + (i+1) + " не участвует")
					continue
					// один ...
				} else if (arrPurchase.length == 1) {
					var seller = arrPurchase[0]
					// console.log("Участник номер " + (i+1) +
					// " покупает у участника номер " + seller)
					// или несколько
				} else {
					var numberSeller = this.randomInteger(0, arrPurchase.length) - 1;
					var seller = this.participants[i].purchase[numberSeller];

					if (seller == undefined || numberSeller == undefined) {
						i = i - 1
						continue
					}

					// console.log("Участник номер " + (i+1) +
					// " покупает у участника номер " + seller)
				}

				console.log("\n")
				// console.log("Участник № " + (i+1) + " будет получать " +
					// this.participants[i].wantResourse + " ресурсов у участника № " + seller)

				// Объём ресурсов продавца и покупателя
				var sellerResours = this.participants[seller - 1].actions
				var bayerResors = this.participants[i].actions

				// console.log("Изначально у них " + bayerResors + " и " + sellerResours + 
					// " ресурсов соответственно")

				// Объём продаваемых ресурсов
				var wantResourse = this.participants[i].wantResourse;

				// Остатки ресурсов у продавца и покупателя
				var balancSseller = sellerResours - wantResourse;
				var balancBayer = this.participants[i].actions + wantResourse;

				// Меняем данные в массиве
				this.participants[seller - 1].actions = balancSseller;
				this.participants[i].actions = balancBayer;

				// console.log("В результате сделки у них осталось " 
					// + balancBayer + " и " + balancSseller + " ресурсов");

			}

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

		deactivate: function() {

			var count = this.count;
			var period = count%3;
			var toEndYear = 3 - period;

			console.log("До конца года осталось " + toEndYear)
			console.log(period)

			// Когда проходит год
			// if (count > 0 && period == 0) {
			if (count > 0) {
				
				// outer: for(j = 0; j < 100; j++) {

					
				var arrLenght = this.participants.length;
					// Проверяем есть ли у нас должники
					for(i = 0; i < arrLenght; i++) {
						var actions = this.participants[i].actions;

						if (actions < 0) {
							this.participants.splice(i, 1);
							i = i - 1;
							arrLenght = arrLenght - 1;
							continue
						}
						// if (arrLenght == i) break outer
					}
					
				// }


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

			// Наполняем массив
			for(i = 0; i < arrLenght; i++) {
				arr[i] = i + 1
			}

			// Решаем между кем будет сделка
			for(j = 0; j < 4; j++) {

				var random = this.randomInteger(0, arrLenght) - 1;

				if (random == undefined || random < 0 || arrWantLight == undefined) {
					j = j - 1;
					continue
				}

				arrWantLight[j] = arr[random];
				arr.splice(random, 1);
				arrLenght = arrLenght - 1;


			}

			// console.log(arrWantLight)
			return arrWantLight


		},

		// Обмен (лайт версия)
		exchange: function() {

			var arrWantLight = this.wantLight();
			var arrLenght = this.participants.length;

			// Принимают и отдают ресурсы
			var setParticipant = [arrWantLight[0], arrWantLight[1]];
			var getParticipant = [arrWantLight[2], arrWantLight[3]];

			// console.log("Принимают ресурсы: " + setParticipant)
			// console.log("Отдают ресурсы: " + getParticipant)

			/*console.log("Участник № " + setParticipant[0] + " принимает ресурсы от " + 
				"учстника №" + getParticipant[0] + "\n" + 
				"Участник № " + setParticipant[1] + " принимает ресурсы от " + 
				"учстника №" + getParticipant[1])
*/

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

			console.log("Состоится 2 сделки" + "\n" + 
				"1) Участник №" + setParticipant[0] + ", владеющий " + setResours[0] + 
				" ресурсами, берёт " + setResoursWant[0] + " ресурсов у участника №" +
				getParticipant[0] + ", который изначально владеет " + getResours[0] +
				" ресурсами. После сделки их баланс " + setResoursAfter[0] + " и " +
				getResoursAfter[0] + "\n" +
				"2) Участник №" + setParticipant[1] + ", владеющий " + setResours[1] + 
				" ресурсами, берёт " + setResoursWant[1] + " ресурсов у участника №" +
				getParticipant[1] + ", который изначально владеет " + getResours[1] +
				" ресурсами. После сделки их баланс " + setResoursAfter[1] + " и " +
				getResoursAfter[1])


		}

	},

	mounted: function() {

		// Наполняем наш наш массив участниками
		for(i = 1; i < 10; i++) {
			this.participants.push({
				number: i,
				status: "Не заёмщик",
				share: Math.random(),
				actions: null,
				wantResourse: this.randomInteger(0, 200),
				at: null,
				pretender: null,
				purchase: []
			})

		}
		
		this.resourceAllocation();
		this.distributionOfStatus();
		// this.want();
		// this.deal();

	}

})