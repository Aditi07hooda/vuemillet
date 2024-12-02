<template>
    <div class="footer-bg-color text-white mt-5">
        <div class="flex px-8 py-4 justify-between border-b-2 ">
            <h2>
                <NuxtLink class="hover:text-pink-400 transition duration-500 " to="/">
                    The Millet Store
                </NuxtLink>
            </h2>
            <div class="flex">
                <a class="bg-white text-black p-2 rounded me-2" href="mailto:hello@themilletstore.in">
                    <LucideMail />
                </a>
                <a class="bg-white text-black p-2 rounded me-2" href=''>
                    <LucideInstagram />
                </a>
                <a class="bg-white text-black p-2 rounded me-2" href=''>
                    <LucideFacebook />
                </a>
                <a class="bg-white text-black p-2 rounded me-2" href=''>
                    <LucideLinkedin />
                </a>
            </div>
        </div>
        <div class="flex justify-evenly p-4">
            <div class="flex-1 p-4">
                <h2 class="mb-3">About Us</h2>
                <ul>
                    <li>
                        <a href="/about" class="hover:text-pink-400 transition duration-500">
                            Our Story
                        </a>
                    </li>
                    <li>
                        <a href="/learn" class="hover:text-pink-400 transition duration-500 ">
                            Learn with Us
                        </a>
                    </li>
                </ul>
            </div>
            <div class="flex-1 p-4">
                <h2 class="mb-3">Help</h2>
                <ul>
                    <li>
                        <a href="/terms" class="hover:text-pink-400 transition duration-500 ">Terms</a>
                    </li>
                    <li>
                        <a href="/privacy"
                            class="hover:text-pink-400 transition duration-500 ">Privacy</a>
                    </li>
                    <li>
                        <a href="/shipping" class="hover:text-pink-400 transition duration-500 ">Shipping
                            & Returns</a>
                    </li>
                </ul>
            </div>
            <div class="flex-1 p-4">
                <h2 class="mb-3">Contact</h2>
                <div>
                    <div>The Millet Store</div>
                    <address class="not-italic">
                        📍 Sy No 114, 1, TK Falls Road, Uttarahalli Hobli, Gulakamale, Bengaluru, Karnataka 560082
                    </address>
                    <a href="mailto:hello@themilletstore.in" class="flex">
                        <span class="me-2">✉️ </span>
                        <span class="underline hover:text-pink-400 transition duration-500">
                            hello@themilletstore.in</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="text-end p-4 pt-0">All Rights Reserved © Basuvaraj (OPC) Private Limited</div>
    </div>
</template>

<style scoped>
h2 {
    font-size: 25px;
    text-transform: uppercase;
}

ul li {
    font-size: 18px;
}

address {
    font-size: 16px;
}

.footer-bg-color {
    background-color: darkgreen;
}
</style>