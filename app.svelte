<script>
	let counter = 0;
	let test = "aaaaaaaa";
	const increment = () => {
		test += "a";
		counter++;
	};
	const decrement = () => {
		test = "bbbbbbbb";
		counter--;
	};
</script>

<h1>Mon titre</h1>
<p>
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
</p>

<button on:click={increment}>Incrementer</button>
<h1>{counter} - {test}</h1>
<button on:click={decrement}>Decrementer</button>
