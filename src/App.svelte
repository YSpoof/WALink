<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";
  let number = $state<string>();
  let message = $state<string>();
  let fullLink = $state<string>();
  let copied = $state<boolean>(false);
  let successDialog: HTMLDialogElement | undefined;

  const generateLink = (e: Event) => {
    e.preventDefault();
    const baseUrl = "https://wa.me/";
    const rawNumber = number?.replace(/\D/g, "").replace(/^55/, "");
    if (!rawNumber) return;

    fullLink = `${baseUrl}55${rawNumber}?text=${encodeURIComponent(message!)}`;
    successDialog?.showModal();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLink!);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };

  const formatInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let formatted = "";

    if (digits.length > 0) formatted += `(${digits.slice(0, 2)}`;
    if (digits.length >= 3) formatted += `) ${digits.slice(2, 7)}`;
    if (digits.length >= 8) formatted += `-${digits.slice(7)}`;

    return formatted;
  };

  const clearFields = () => {
    number = undefined;
    message = undefined;
  };
</script>

<main
  class="min-h-screen bg-gray-50 py-12 px-6 flex items-start justify-center"
>
  <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
    <section class="bg-white rounded-2xl shadow-lg px-6 pt-6 md:p-8">
      <h2 class="text-lg font-semibold text-gray-800">WALink Generator</h2>
      <p class="text-sm text-gray-500 mt-2">
        Gere links para contato no WhatsApp de forma fácil e gratuita.
      </p>

      <form onsubmit={generateLink}>
        <div class="mt-6">
          <label class="text-sm text-gray-600">Telefone</label>
          <div class="mt-2 flex items-center gap-3">
            <input
              bind:value={number}
              autofocus
              autocomplete="tel-national"
              placeholder="(11) 98765-4321"
              oninput={(e) => (number = formatInput(e.currentTarget.value))}
              type="tel"
              inputmode="tel"
              class="flex-1 px-4 py-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="text-sm text-gray-600">Mensagem personalizada</label>
          <div class="mt-2 flex items-start gap-3">
            <textarea
              bind:value={message}
              maxlength={500}
              placeholder="Adicione uma mensagem personalizada que os usuários enviarão para você"
              class="flex-1 px-4 py-3 rounded-lg bg-gray-100 border min-h-30 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              >Olá, vim através do site.</textarea
            >
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3">
          <button
            type="submit"
            disabled={!number?.trim() || !message?.trim()}
            class="uppercase bg-green-500 not-disabled:hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-full font-medium"
            >Gerar link</button
          >
          <button
            type="button"
            onclick={clearFields}
            class="uppercase text-sm text-gray-600 underline">Limpar</button
          >
        </div>
      </form>
      <p class="text-center opacity-75 mt-2">
        Desenvolvido por <a
          href="https://lzart.com.br"
          target="_blank"
          class="text-blue-500 underline">LZArt</a
        >
      </p>
    </section>

    <section class="flex items-center justify-center">
      <div
        class="w-full max-w-xs bg-white border rounded-2xl shadow-xl overflow-hidden"
      >
        <div class="px-4 py-3 bg-gray-100 flex items-center gap-3">
          <div class="h-9 w-9 rounded-full bg-gray-300"></div>
          <div class="text-sm text-gray-700">
            {number ? `+55 ${number}` : "+55 (11) 98765-4321"}
          </div>
        </div>
        <div class="h-96 phone-safe-area p-4">
          <div
            class="h-full rounded-md bg-gray-50 border border-dashed border-gray-200"
          ></div>
        </div>
        <div class="px-4 py-3 bg-white">
          <div class="flex items-center gap-3">
            <textarea
              class="flex-1 bg-gray-100 rounded-full px-5 py-2 resize-none field-sizing-content max-h-20"
              placeholder="Mensagem"
              disabled
              readonly
              bind:value={message}
            ></textarea>
            <button class="ml-2 text-gray-400">➤</button>
          </div>
        </div>
      </div>
    </section>

    <dialog
      bind:this={successDialog}
      class="rounded-lg p-0 m-auto backdrop:bg-black/25 backdrop:backdrop-blur-xs"
    >
      <div class="p-6">
        <p class="text-gray-800 font-medium">
          Seu link foi gerado com sucesso!
        </p>
        <input
          type="text"
          value={fullLink}
          readonly
          class="mt-3 w-full px-3 py-2 rounded-md bg-gray-100"
        />
        <div class="mt-4 flex justify-between gap-3">
          <button
            onclick={handleCopy}
            class="uppercase w-full bg-green-500 text-white px-4 py-2 rounded-md"
            >{#if copied}Copiado!{:else}Copiar{/if}</button
          >
          <button
            onclick={() => successDialog?.close()}
            class="uppercase w-full px-4 py-2 rounded-md border">Fechar</button
          >
        </div>
      </div>
    </dialog>
  </div>
</main>
