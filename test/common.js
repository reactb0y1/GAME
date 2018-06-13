var app = new Vue ({

	el: "#container",

	data: {
		participants: []
	},

	methods: {

		// Распределение ресурсов
		resourceAllocation: function() {

			// Этот массив будем наполнять долями
			var shares = [];

			// Создаём массив с долями
			for(i = 0; i < 9; i++) {
				var share = +this.participants[i].share;
				shares.push(share)
			}
			
			// Сумма долей
			var summ = 0;
			for(j = 0; j < 9; j++) {
				summ = summ + shares[j]
			}

			// Высчитываем акции
			var actions = [];
			for(k = 0; k < 9; k++) {
				var action = this.participants[k].share * 1000 / summ;
				action = Math.round(action);
				actions.push(action)
			}

			for(kk = 0; kk < 9; kk++) {
				this.participants[kk].actions = actions[kk]
			}

		},

		// Распределение статусов
		distributionOfStatus: function() {

			var numbers = [];

			for(i = 1; i < 10; i++) {
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

			// Проходим по всем участникам
			for(i = 0; i < 9; i++) {

				// Массив для всех, кроме одного
				var arr = [];
				// Массив для адресатов запроса
				var	arrAt = [];
				// Массив для претендентов на подтверждение запроса
				var arrWant = [];

				for(j = 1; j < 10; j++) {
					arr[j - 1] = j
				}

				arr.splice(i, 1);

				// Наполняем массив адресатов
				for(k = 0; k < 3; k++) {
					var random = this.randomIntegerArr(0, arr.length);

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
					var random = this.randomIntegerArr(0, arr.length);

					/*Если вдруг значение случайного числа оказалось большим, чем
					длинаа массива, то увеличим к-во итераций и завершим текущую*/
					if (arr[random] == undefined) {
						l = l - 1
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
		randomIntegerArr: function (min, max) {
			min = min - 0.5;
			max = max + 0.5;

			// Проверить работоспособность кода можно постепенно увеличивая значение этой переменной
			var randomMinMaxDifference = max - min,
					randomNonInteger = randomMinMaxDifference + min,
					randomValue = Math.random(),
					randomValueRange = randomValue * randomNonInteger,
					randomValueRangeRound = Math.round(randomValueRange);

			return randomValueRangeRound;
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
				want: 100,
				at: null,
				pretender: null
			})

		}

		this.resourceAllocation();
		this.distributionOfStatus();
		this.want();

	}

})