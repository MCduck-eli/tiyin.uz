export const translations = {
    uz: {
        nav: {
            login: "Kirish",
            getStarted: "Boshlash",
            home: "Asosiy",
            howItWorks: "Qanday ishlaydi?",
        },
        hero: {
            badge: "Yangi avlod moliya yordamchisi",
            title: "Pulingizni sanashni o'rganing.",
            subtitle:
                "Tiyin — murakkab jadvallardan charchaganlar uchun. Minimalistik dizayn, maksimal natija va aqlli tahlil.",
            ctaStart: "Hisob ochish",
            ctaHow: "Qanday ishlaydi?",
        },
        dashboard: {
            welcome: "Xush kelibsiz!",
            subWelcome: "Bugungi moliyaviy holatingiz bilan tanishing.",
            addExpense: "Xarajat qo'shish",
            stats: {
                balance: "Umumiy balans",
                monthly: "Oylik xarajat",
                plan: "Reja qoldiqlari",
                savings: "Tejamkorlik",
            },
            charts: {
                dynamics: "Xarajatlar dinamikasi",
                recent: "So'nggi amallar",
                noData: "Hali ma'lumotlar yo'q",
                addFirst: "Birinchi xarajatingizni qo'shing",
            },
        },
        howItWorks: {
            title: "Tiyin qanday ishlaydi?",
            subtitle: "Sizning pullaringiz — sizning nazoratingizda",
            steps: [
                {
                    title: "Harajatni yozing",
                    desc: "Har bir xaridni sekundlar ichida qo'lda kiriting.",
                },
                {
                    title: "Avtomatik tahlil",
                    desc: "Haftalik, oylik va yillik sarf-harajatlarni chiroyli grafiklarda ko'ring.",
                },
                {
                    title: "Aqlli ogohlantirish",
                    desc: "Limit belgilang, oshib ketsa biz sizni ogohlantiramiz.",
                },
            ],
            categories: "Maxsus kategoriyalar",
            customCat: "+ O'z kategoriyangiz",
            button: "Tushunarli, boshladik!",
        },
    },
    ru: {
        nav: {
            login: "Войти",
            getStarted: "Начать",
            home: "Главная",
            howItWorks: "Как это работает?",
        },
        hero: {
            badge: "Финансовый помощник нового поколения",
            title: "Научитесь считать свои деньги.",
            subtitle:
                "Tiyin — для тех, кто устал от сложных таблиц. Минималистичный дизайн и умная аналитика.",
            ctaStart: "Открыть счет",
            ctaHow: "Как это работает?",
        },
        dashboard: {
            welcome: "Добро пожаловать!",
            subWelcome: "Ознакомьтесь с вашим финансовым состоянием.",
            addExpense: "Добавить расход",
            stats: {
                balance: "Общий баланс",
                monthly: "Месячный расход",
                plan: "Остатки плана",
                savings: "Экономия",
            },
            charts: {
                dynamics: "Динамика расходов",
                recent: "Последние операции",
                noData: "Данных пока нет",
                addFirst: "Добавьте свой первый расход",
            },
        },
        howItWorks: {
            title: "Как работает Tiyin?",
            subtitle: "Ваши деньги — под вашим контролем",
            steps: [
                {
                    title: "Записывайте расход",
                    desc: "Вводите каждую покупку вручную за считанные секунды.",
                },
                {
                    title: "Авто-анализ",
                    desc: "Смотрите недельные и годовые отчеты в красивых графиках.",
                },
                {
                    title: "Умное уведомление",
                    desc: "Установите лимит, и мы предупредим вас при его превышении.",
                },
            ],
            categories: "Специальные категории",
            customCat: "+ Своя категория",
            button: "Понятно, начнем!",
        },
    },
    en: {
        nav: {
            login: "Login",
            getStarted: "Get Started",
            home: "Home",
            howItWorks: "How it works?",
        },
        hero: {
            badge: "Next generation finance assistant",
            title: "Learn to count your money.",
            subtitle:
                "Tiyin — for those tired of complex spreadsheets. Minimalist design and smart analytics.",
            ctaStart: "Open Account",
            ctaHow: "How it works?",
        },
        dashboard: {
            welcome: "Welcome!",
            subWelcome: "Check your financial status today.",
            addExpense: "Add Expense",
            stats: {
                balance: "Total Balance",
                monthly: "Monthly Expense",
                plan: "Budget Limits",
                savings: "Savings",
            },
            charts: {
                dynamics: "Expense Dynamics",
                recent: "Recent Transactions",
                noData: "No data yet",
                addFirst: "Add your first expense",
            },
        },
        howItWorks: {
            title: "How Tiyin works?",
            subtitle: "Your money — under your control",
            steps: [
                {
                    title: "Log your spending",
                    desc: "Enter every purchase manually in seconds.",
                },
                {
                    title: "Auto Analysis",
                    desc: "View weekly and yearly spending in beautiful charts.",
                },
                {
                    title: "Smart Alert",
                    desc: "Set limits and we'll warn you if you exceed them.",
                },
            ],
            categories: "Special Categories",
            customCat: "+ Own category",
            button: "Got it, let's start!",
        },
    },
};

export type Language = "uz" | "ru" | "en";
