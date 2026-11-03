// ---------- Menu data: Kimchi Garden's full menu as listed on Yelp (yelp.com/menu/kimchi-garden-berkeley), Oct 2026 ----------
// Each item: [name, Korean name, price in dollars (null = not confirmed), short description, flag]
// flag: 'best' = most-reviewed favorite · 'spicy' · 'veg' = marked vegetarian or vegan on the menu
// This one file feeds the menu tabs, the cart, the order helper and the payment server (api/_menu.js).
var MENU = [
  { id: 'apps', label: 'Appetizers', items: [
    ['Seafood Pancake', '해물파전', 18.00, 'Mixed seafood and green onion, pan-fried in pancake batter.'],
    ['Kimchi Pancake', '김치전', 16.80, 'Kimchi and green onion, pan-fried in pancake batter.'],
    ['Kimchi & Seafood Pancake', '김치해물전', 19.20, 'Kimchi, mixed seafood and green onion in one crispy pancake.'],
    ['Pork Fried Dumplings (8 pcs)', '고기 군만두', 9.60, 'Pork and vegetable dumplings, deep fried.'],
    ['Vegetable Fried Dumplings (7 pcs)', '야채 군만두', 9.60, 'Vegetable dumplings, deep fried.'],
    ['Deluxe Fried Dumplings', '디럭스 군만두', 10.80, 'Fried dumplings drizzled with sweet and savory sauce. Vegetable (7) or pork (8).'],
    ['Steamed Dumplings (6 pcs)', '찐만두', 9.60, 'Six steamed dumplings.'],
    ['Hotteok (2 pcs)', '호떡', 6.60, 'Chewy pan-fried pancakes filled with brown sugar, cinnamon and nuts.'],
    ['Fried Seaweed Rolls (8 pcs)', '김말이', 9.60, 'Glass noodles and vegetables wrapped in seaweed, deep fried. Vegetarian and vegan.', 'veg'],
    ['Fried Cheese Sticks (5 pcs)', '치즈스틱', 8.40, 'Deep-fried mozzarella sticks. Vegetarian.', 'veg'],
    ['Potato Fries', '감자튀김', 7.20, 'Classic fries.'],
    ['Waffle Potato Fries', '와플 감자튀김', 8.40, 'Deep-fried waffle fries. Vegetarian and vegan.', 'veg']
  ]},
  { id: 'hotdogs', label: 'Korean Hot Dogs', items: [
    ['Original (R1)', '오리지널 핫도그', 5.99, 'Classic Korean corn dog. Order 5 minutes ahead so it stays crunchy.'],
    ['Half N Half (R2)', '반반 핫도그', 6.59, 'Half sausage, half mozzarella.'],
    ['Mozzarella (R3)', '모짜렐라 핫도그', 6.59, 'All mozzarella cheese pull.'],
    ['Original with Potato (R1-PO)', '감자 핫도그', 7.19, 'Original, coated in crispy potato cubes.'],
    ['Half N Half with Potato (R2-PO)', '감자 반반 핫도그', 7.80, 'Half sausage, half mozzarella, with potato crust.'],
    ['Mozzarella with Potato (R3-PO)', '감자 모짜렐라 핫도그', 7.80, 'Mozzarella with potato crust.'],
    ['Hot Cheetos Original (R1HOT)', '핫치토스 핫도그', 7.19, 'Original, rolled in Hot Cheetos.', 'spicy'],
    ['Hot Cheetos Half & Half (R2HOT)', '핫치토스 반반', 7.80, 'Half sausage, half mozzarella, rolled in Hot Cheetos.', 'spicy'],
    ['Hot Cheetos Mozzarella (R3HOT)', '핫치토스 모짜렐라', 7.80, 'Mozzarella, rolled in Hot Cheetos.', 'spicy'],
    ['Hot Cheetos Nacho Potato Original (R1-HOT-PO)', '핫치토스 나초 감자', 7.80, 'Original with Hot Cheetos, nacho cheese and potato.', 'spicy'],
    ['Hot Cheetos Nacho Potato Half N Half (R2-HOT-PO)', '핫치토스 나초 반반', 8.39, 'Half and half with Hot Cheetos, nacho cheese and potato.', 'spicy'],
    ['Hot Cheetos Nacho Potato Mozzarella (R3-HOT-PO)', '핫치토스 나초 모짜렐라', 8.39, 'Mozzarella with Hot Cheetos, nacho cheese and potato.', 'spicy'],
    ['Pizza Corn Dog (R1 Pizza)', '피자 핫도그', 7.19, 'Beef sausage with tomato and cheese. Tastes like pizza.'],
    ['Pizza Half & Half (R2 Pizza)', '피자 반반', 7.80, 'Half beef sausage, half mozzarella, pizza style.'],
    ['Pizza Mozzarella (R3 Pizza)', '피자 모짜렐라', 7.80, 'Mozzarella, pizza style.']
  ]},
  { id: 'dukbokgi', label: 'Dukbokgi', items: [
    ['Spicy Dukbokgi', '떡볶이', 15.60, 'Rice cakes with fish cake, boiled egg and vegetables in spicy sauce.', 'spicy'],
    ['Rose Dukbokgi', '로제 떡볶이', 18.60, 'Rice cakes with bacon and sausage in creamy rose sauce.'],
    ['Mala Spicy Dukbokgi', '마라 떡볶이', 18.00, 'Rice cakes, fish cake, egg, vegetables and glass noodles in spicy mala sauce.', 'spicy']
  ]},
  { id: 'rice', label: 'Fried Rice', items: [
    ['Kimchi Fried Rice', '김치볶음밥', 16.80, 'House-made kimchi fried rice with your choice of topping and a fried egg on top.', 'best'],
    ['Kimchi Omelette', '김치 오므라이스', 18.60, 'Kimchi fried rice with Spam, wrapped in egg.'],
    ['Omelette Fried Rice', '오므라이스', 17.40, 'Fried rice with vegetables and Spam, wrapped in egg.']
  ]},
  { id: 'bbq', label: 'Korean BBQ', items: [
    ['BBQ Short Rib Galbi', 'LA 갈비', 25.20, 'Marinated short ribs off the grill. Rice included.'],
    ['BBQ Beef (Bulgogi)', '불고기', 20.40, 'Thin-sliced beef with onions in house marinade. Rice included.'],
    ['BBQ Chicken', '닭불고기', 18.00, 'Grilled chicken in house Korean BBQ sauce. Rice included.'],
    ['Spicy Chicken', '매운 닭불고기', 18.00, 'Grilled chicken in spicy house BBQ sauce. Rice included.', 'spicy'],
    ['BBQ Spicy Pork', '제육볶음', 18.00, 'Stir-fried sliced pork in house spicy sauce. Rice included.', 'spicy'],
    ['Pork Belly', '삼겹살', 19.20, 'Sliced pork belly and onions. Rice included.'],
    ['Kimchi Pork Belly', '김치 삼겹살', 20.40, 'Stir-fried kimchi and pork belly. Rice included.', 'spicy'],
    ['Spicy Pork Belly', '매운 삼겹살', 20.40, 'Sliced pork belly with onions in spicy sauce. Rice included.', 'spicy'],
    ['Spicy Stir-fried Squid', '오징어 볶음', 20.40, 'Squid stir-fried in a bright, spicy red sauce. Rice included.', 'spicy']
  ]},
  { id: 'soup', label: 'Soup & Stew', items: [
    ['Tofu Soup', '순두부찌개', 16.80, 'Soft tofu soup with your choice of broth and toppings, egg inside. Served with rice.', 'best'],
    ['Mala Tofu Soup', '마라 순두부', 16.80, 'Soft tofu soup in mala broth with your choice of toppings. Served with rice.', 'spicy'],
    ['Kimchi Stew', '김치찌개', 16.20, 'Fermented kimchi, tofu and vegetables. Served with rice.', 'spicy'],
    ['Mala Kimchi Stew', '마라 김치찌개', 16.80, 'Kimchi stew with mala spice. Served with rice.', 'spicy'],
    ['Rice Cake Soup with Dumpling', '떡만두국', 17.40, 'Rice cakes and dumplings in beef bone broth simmered 12+ hours.'],
    ['Beef Bone Soup', '곰탕', 18.60, 'Beef bone broth simmered 12+ hours, with beef and noodles.']
  ]},
  { id: 'bibimbap', label: 'Bibimbap', items: [
    ['Bibimbap', '비빔밥', 18.60, 'Assorted vegetables over rice with a fried egg on top.', 'best'],
    ['Dolsot Bibimbap', '돌솥비빔밥', 20.40, 'Bibimbap in a sizzling stone pot, with crispy rice on the bottom.']
  ]},
  { id: 'kimbap', label: 'Kimbap', items: [
    ['Beef Kimbap (2 rolls)', '소고기 김밥', 16.80, 'Seasoned rice rolled with beef and vegetables.', 'best'],
    ['Vegetable Kimbap (2 rolls)', '야채 김밥', 16.80, 'Seasoned rice rolled with assorted vegetables.'],
    ['Seafood Kimbap (2 rolls)', '해물 김밥', 16.80, 'Seasoned rice rolled with vegetables and imitation crab.'],
    ['Beef Kimbap (1 roll)', '소고기 김밥 1줄', 9.60, 'One roll of beef kimbap.'],
    ['Vegetable Kimbap (1 roll)', '야채 김밥 1줄', 9.60, 'One roll of vegetable kimbap.'],
    ['Shrimp Tempura Kimbap (1 roll)', '새우튀김 김밥', 14.40, 'Fried shrimp, lettuce, yellow radish, burdock, egg and imitation crab, with mayo and teriyaki.'],
    ['Tuna Mayo Kimbap (1 roll)', '참치마요 김밥', 13.20, 'Tuna, lettuce, yellow radish, burdock and egg, with mayo and teriyaki.'],
    ['Tonkatsu Kimbap (1 roll)', '돈까스 김밥', 14.40, 'Sliced pork cutlet, lettuce, radish, burdock, imitation crab and egg, with mayo and tonkatsu sauce.'],
    ['Spicy Pork Kimbap (1 roll)', '제육 김밥', 13.20, 'Spicy pork, lettuce, yellow radish, jalapeño, egg and carrot.', 'spicy']
  ]},
  { id: 'noodles', label: 'Noodles', items: [
    ['Japchae', '잡채', 15.60, 'Stir-fried sweet potato glass noodles with assorted vegetables.', 'best'],
    ['Spicy Vegetable Ramen', '야채 라면', 9.60, 'Spicy ramen with vegetables and optional toppings.', 'spicy']
  ]},
  { id: 'chicken', label: 'Fried Chicken & Wings', items: [
    ['Korean Fried Chicken', '후라이드 치킨', 26.40, 'Huge 8 pieces: 2 drumsticks, 2 wings, 2 breasts, 2 thighs.'],
    ['Sweet N Spicy Fried Chicken', '양념 치킨', 28.20, '8 pieces in sweet and spicy sauce.', 'spicy'],
    ['Soy Garlic Fried Chicken', '간장 치킨', 28.20, '8 pieces in soy garlic sauce.'],
    ['Original Wings', '후라이드 윙', 21.60, 'Fried wings.'],
    ['Soy Garlic Wings', '간장 윙', 22.20, 'Fried wings dipped in house soy garlic sauce.'],
    ['Sweet & Spicy Wings', '양념 윙', 22.20, 'Fried wings dipped in house spicy sauce.', 'spicy']
  ]},
  { id: 'bowls', label: 'Tonkatsu & Rice Bowls', items: [
    ['Tonkatsu', '돈까스', 18.00, 'Fried pork cutlet with house tonkatsu sauce. Rice on the side.'],
    ['Tuna Mayo Bowl', '참치마요 덮밥', 16.20, 'Tuna, shredded egg, seaweed and sauce over rice.'],
    ['Chicken Mayo Bowl', '치킨마요 덮밥', 16.20, 'Grilled chicken, shredded egg, seaweed and sauce over rice.'],
    ['Tonkatsu Mayo Bowl', '돈까스마요 덮밥', 16.20, 'Pork cutlet, shredded egg, seaweed and sauce over rice.'],
    ['Spam Mayo Bowl', '스팸마요 덮밥', 16.20, 'Pan-fried Spam, shredded egg, seaweed and sauce over rice.'],
    ['Tofu Mayo Bowl', '두부마요 덮밥', 16.20, 'Pan-fried tofu, shredded egg, seaweed and sauce over rice.'],
    ['Bacon & Sausage Mayo Bowl', '베이컨 소시지 덮밥', 14.40, 'Bacon and beef sausage over rice.']
  ]},
  { id: 'drinks', label: 'Drinks & Slushes', items: [
    ['Mangonada Slush', '망고나다 슬러시', 7.20, 'Non-dairy.'],
    ['Mango Slush', '망고 슬러시', 6.60, 'Non-dairy.'],
    ['Strawberry Slush', '딸기 슬러시', 6.60, 'Non-dairy.'],
    ['Strawberry Milk', '딸기 우유', 6.00, 'Sweet strawberry milk.'],
    ['15 Mixed Grain Latte', '미숫가루', 7.20, 'Nutty Korean multigrain latte.'],
    ['Sweet Potato Smoothie', '고구마 스무디', 7.20, 'Korean sweet potato smoothie.'],
    ['Sweet Potato Milk Tea', '고구마 밀크티', 6.00, 'Korean sweet potato milk tea.'],
    ['Chodang Corn Smoothie', '초당옥수수 스무디', 7.20, 'Sweet Korean corn smoothie.'],
    ['Chodang Corn Milk Tea', '초당옥수수 밀크티', 6.00, 'Sweet Korean corn milk tea.'],
    ['Korean Pear Smoothie', '배 스무디', 7.20, 'Korean pear smoothie.'],
    ['Milkis', '밀키스', 3.30, 'Fizzy milk-and-yogurt soda.'],
    ['Bong Bong Grape', '봉봉', 3.60, 'Grape juice with grape pulp.'],
    ['Coke', '콜라', 3.30, ''],
    ['Coke Zero', '제로 콜라', 3.30, ''],
    ['Diet Coke', '다이어트 콜라', 3.30, ''],
    ['Sprite', '스프라이트', 3.30, '']
  ]},
  { id: 'kimchi', label: 'Fresh Kimchi', items: [
    ['Fresh Kimchi (16 oz)', '김치 16온스', 13.20, 'House-made napa cabbage kimchi to take home.', 'spicy'],
    ['Fresh Kimchi (24 oz)', '김치 24온스', 18.00, 'House-made napa cabbage kimchi to take home.', 'spicy']
  ]}
];
