
        export default function() {
            let h1_1;
let Text_2;
let p_3;
let Text_4;
let button_5;
let Text_6;
let h1_7;
let Expression_8;
let Text_9;
let Expression_10;
let button_11;
let Text_12;
            let counter = 0;
let test = 'aaaaaaaa';
const increment = () => {
    test += 'a', lifecycles.update([test]);
    counter++, lifecycles.update([counter]);
};
const decrement = () => {
    test = 'bbbbbbbb', lifecycles.update([test]);
    counter--, lifecycles.update([counter]);
};
            const lifecycles = {
                create(target) {
                    h1_1 = document.createElement("h1");
Text_2 = document.createTextNode(`Mon titre`);
h1_1.appendChild(Text_2);
target.appendChild(h1_1);
p_3 = document.createElement("p");
Text_4 = document.createTextNode(`
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro temporibus,
	consequuntur enim atque ea veniam quia beatae quae pariatur explicabo natus
	numquam nam quidem minima? Blanditiis in impedit dolorum sunt. Lorem, ipsum
	dolor sit amet consectetur adipisicing elit. Nam quae laborum explicabo
	aspernatur perspiciatis dignissimos illo. Illum excepturi nisi earum
	reiciendis esse nemo at rerum pariatur vitae rem. Ut, sit. Lorem ipsum dolor
	sit amet consectetur adipisicing elit. Reiciendis atque quis, vitae, impedit
	at a voluptatibus, eveniet facilis earum velit facere dolorem excepturi id.
	Sit ab quaerat distinctio totam u Lorem ipsum dolor sit, amet consectetur
	adipisicing elit. Nihil, autem? Iure ipsa recusandae molestias eius, sunt
	omnis? Aut sit laborum odit reprehenderit tenetur, veniam adipisci modi sequi
	pariatur dolorum ratione!
`);
p_3.appendChild(Text_4);
target.appendChild(p_3);
button_5 = document.createElement("button");
button_5.addEventListener("click", increment);
Text_6 = document.createTextNode(`Incrementer`);
button_5.appendChild(Text_6);
target.appendChild(button_5);
h1_7 = document.createElement("h1");
Expression_8 = document.createTextNode(counter);
h1_7.appendChild(Expression_8);
Text_9 = document.createTextNode(` - `);
h1_7.appendChild(Text_9);
Expression_10 = document.createTextNode(test);
h1_7.appendChild(Expression_10);
target.appendChild(h1_7);
button_11 = document.createElement("button");
button_11.addEventListener("click", decrement);
Text_12 = document.createTextNode(`Decrementer`);
button_11.appendChild(Text_12);
target.appendChild(button_11);
                },
                update(changed) {
                    if (changed.includes(counter)) {
                            Expression_8.data = counter;
                        }
if (changed.includes(test)) {
                            Expression_10.data = test;
                        }
                },
                destroy() {
                    h1_1.removeChild(Text_2);
target.removeChild(h1_1);
p_3.removeChild(Text_4);
target.removeChild(p_3);
button_5.removeEventListener("click", increment);
button_5.removeChild(Text_6);
target.removeChild(button_5);
h1_7.removeChild(Expression_8);
h1_7.removeChild(Text_9);
h1_7.removeChild(Expression_10);
target.removeChild(h1_7);
button_11.removeEventListener("click", decrement);
button_11.removeChild(Text_12);
target.removeChild(button_11);
                }
            }

            return lifecycles;
        }
    