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

		// Определяем кому готов отдать ресурсы и у кого готов получить
		want: function() {
			/*
			Двойной цикл. На уровне первого мы создаём массив чисел из
			последовательности от 1 до 9. Тут же мы будем последовательно
			удалять один из элементов. То есть на каждой итерации у нас будет 8
			элементов без одного из чисел. Во вложенном цикле мы будем выбирать 3
			числа из оставшихся 8 в массиве и копировать их в новый массив, который,
			как это понятно, состоит из 3 элементов. Разумеется, нужно обеспечить то,
			чтобы в этот маленький массив число попадало единожды, то есть не должно
			было повторений. Под конец вложенного цикла мы задаём значение свойству
			at - наш маленький массив
			*/

			var arrLenght = this.participants.length;

			// Проходим по всем участникам
			for(i = 0; i < arrLenght; i++) {

				// Массив для всех, кроме одного
				var arr = [];
				// Массив для адресатов запроса
				var	arrAt = [];
				// Массив для претендентов на подтверждение запроса
				var arrWant = [];

				for(j = 1; j < arrLenght + 1; j++) {
					arr[j - 1] = j
				}

				// Удаляем номер нашего участника
				arr.splice(i, 1);

				// Наполняем массив адресатов
				for(k = 0; k < 3; k++) {
					var random = this.randomInteger(0, arr.length);

					/*Если вдруг значение случайного числа оказалось большим, чем
					длинаа массива, то увеличим к-во итераций и завершим текущую*/
					if (arr[random] == undefined) {
						k = k - 1
						continue
					}

					arrAt.push(arr[random]);
					arr.splice(random, 1)
				}

				// Пополняем список тех, у кого участник хочет получить ресурсы
				this.participants[i].at = arrAt

				// Наполняем массив претендернтов на подтверждение запроса
				for(l = 0; l < 3; l++) {
					var random = this.randomInteger(0, arr.length);

					/*Если вдруг значение случайного числа оказалось большим, чем
					длинаа массива, то увеличим к-во итераций и завершим текущую*/
					if (arr[random] == undefined) {
						// l = l - 1
						continue
					}

					arrWant.push(arr[random]);
					arr.splice(random, 1)
				}

				// Пополняем список тех, у кого участник хочет получить ресурсы
				this.participants[i].pretender = arrWant

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

		// Сделка
		deal: function() {

			var arrLenght = this.participants.length;

			for(i = 0; i < arrLenght; i++) {

				// Формируем список всех тех, у кого готов принять ресурсы ...
				var at = this.participants[i].at;

				console.log("\n")
				// console.log("Участник " + (i + 1) + " готов принять ресурсы у игроков " + 
					// at[0] + ", " + at[1] + " и " + at[2] +
					// ". А те, в свою очередь, готовы отдать следующим участникам")
				
				// Узнаём то, кому они готовы отдавать ресурсы
				for(j = 0; j < 3; j++) {

					var pretender = this.participants[at[j] - 1].pretender;
					// console.log("Участник " + at[j] + ": " + pretender[0] + ", " +
					// pretender[1] + " и " + pretender[2])

					if((i + 1) == pretender[0] || (i + 1) == pretender[1] || 
						(i + 1) == pretender[2]) {
						console.log("Сделка состоится между " + (i + 1) + " и " + at[j])
						
						this.participants[i].purchase.push(at[j])

					}

				}
			}
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
				wantResourse: this.randomInteger(0, 600),
				at: null,
				pretender: null,
				purchase: []
			})

		}
		
		this.resourceAllocation();
		this.distributionOfStatus();
		this.want();
		this.deal();

	}

})