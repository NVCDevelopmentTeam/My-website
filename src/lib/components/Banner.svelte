<script>
    export let title = "Welcome";
    export let subtitle = "Explore our website";
    export let backgroundImage = "";
    export let backgroundColor = "#1a1a1a";
    export let textColor = "white";
    export let showButton = true;
    export let buttonText = "Learn More";
    export let buttonLink = "/";
</script>

<div 
    class="w-full min-h-[400px] bg-cover bg-center flex items-center justify-center p-8 text-center"
    style="background-image: url({backgroundImage}); 
           background-color: {backgroundColor}; 
           color: {textColor};"
>
    <div class="max-w-3xl animate-fadeIn">
        <h1 class="text-4xl md:text-5xl mb-4 font-bold">{title}</h1>
        <p class="text-lg md:text-xl mb-8">{subtitle}</p>
        {#if showButton}
            <a 
                href={buttonLink} 
                class="inline-block px-6 py-3 bg-white text-gray-900 rounded-md 
                       transition-all duration-300 hover:-translate-y-0.5 
                       hover:shadow-lg"
            >
                {buttonText}
            </a>
        {/if}    </div>
</div>