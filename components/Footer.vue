<template>
    <div class="footer-bg-color text-white mt-5">
        <div class="flex px-8 py-4 justify-between border-b-2 ">
            <h2>The Millet Store</h2>
            <div class="flex">
                <NuxtLink class="bg-white text-black p-2 rounded me-2" to="/">
                    <LucideInstagram />
                </NuxtLink>
                <NuxtLink class="bg-white text-black p-2 rounded me-2" to="/">
                    <LucideFacebook />
                </NuxtLink>
                <NuxtLink class="bg-white text-black p-2 rounded me-2" to="/">
                    <LucideLinkedin />
                </NuxtLink>
            </div>
        </div>
        <div class="flex justify-evenly p-4">
            <div class="flex-1 p-4">
                <h2 class="mb-3">About Us</h2>
                <ul>
                    <li>
                        <NuxtLink to="/about">
                            Our Story
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/learn">
                            Learn with Us
                        </NuxtLink>
                    </li>
                </ul>
            </div>
            <div class="flex-1 p-4">
                <h2 class="mb-3">Help</h2>
                <ul>
                    <li>
                        <NuxtLink to="/terms">Terms</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/privacy">Privacy</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/shipping">Shipping & Returns</NuxtLink>
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
                    <div>
                        ✉️ xyz@gmail.com
                    </div>
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