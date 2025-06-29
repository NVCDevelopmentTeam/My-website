<script>
    /** @type {{title?: string, subtitle?: string, backgroundImage?: string, backgroundColor?: string, textColor?: string, showButton?: boolean, buttonText?: string, buttonLink?: string}} */
    let {
        title = "Welcome",
        subtitle = "Explore our website",
        backgroundImage = "",
        backgroundColor = "#1a1a1a",
        textColor = "white",
        showButton = true,
        buttonText = "Learn More",
        buttonLink = "/"
    } = $props();
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