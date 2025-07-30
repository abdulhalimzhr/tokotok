<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Wallet
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Manage your wallet balance and view your purchase history.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Wallet Balance
              </h2>
              <div
                class="bg-green-100 dark:bg-green-900 p-2 rounded-lg"
              >
                <Icon
                  name="i-heroicons-wallet"
                  class="w-6 h-6 text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <div
              class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2"
            >
              ${{ walletStore.balance.toFixed(2) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Available for purchases
            </p>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div
              class="p-6 border-b border-gray-200 dark:border-gray-700"
            >
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Recent Transactions
              </h2>
              <p
                class="text-gray-600 dark:text-gray-400 text-sm mt-1"
              >
                Your latest wallet activity
              </p>
            </div>
            <div class="p-6">
              <div
                v-if="walletStore.transactions.length === 0"
                class="text-center py-8"
              >
                <Icon
                  name="i-heroicons-receipt-percent"
                  class="w-12 h-12 text-gray-400 mx-auto mb-3"
                />
                <p class="text-gray-500 dark:text-gray-400">
                  No transactions yet
                </p>
                <p class="text-sm text-gray-400 dark:text-gray-500">
                  Start shopping to see your purchase history!
                </p>
              </div>
              <div
                v-else
                class="space-y-4"
              >
                <div
                  v-for="transaction in recentTransactions"
                  :key="transaction.id"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      :class="
                        getTransactionIconClass(transaction.type)
                      "
                    >
                      <Icon
                        :name="getTransactionIcon(transaction.type)"
                        class="w-4 h-4"
                      />
                    </div>
                    <div>
                      <p
                        class="font-medium text-gray-900 dark:text-white"
                      >
                        {{ transaction.description }}
                      </p>
                      <p
                        class="text-sm text-gray-500 dark:text-gray-400"
                      >
                        {{ formatDate(transaction.timestamp) }}
                      </p>
                    </div>
                  </div>
                  <div :class="getAmountClass(transaction.type)">
                    {{ transaction.type === 'topup' ? '+' : '-' }}${{
                      Math.abs(transaction.amount).toFixed(2)
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Quick Top Up
            </h3>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button
                v-for="amount in quickAmounts"
                :key="amount"
                @click="quickTopUp(amount)"
                :disabled="walletStore.loading"
                class="p-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                <div
                  class="font-semibold text-gray-900 dark:text-white"
                >
                  ${{ amount }}
                </div>
              </button>
            </div>
            <button
              @click="openCustomTopUpModal"
              class="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Custom Amount
            </button>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Quick Stats
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  Total Spent
                </span>
                <span
                  class="font-semibold text-gray-900 dark:text-white"
                >
                  ${{ totalSpent.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  Total Added
                </span>
                <span
                  class="font-semibold text-gray-900 dark:text-white"
                >
                  ${{ totalAdded.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  Transactions
                </span>
                <span
                  class="font-semibold text-gray-900 dark:text-white"
                >
                  {{ walletStore.transactions.length }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Quick Actions
            </h3>
            <div class="space-y-3">
              <NuxtLink
                to="/"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Icon
                  name="i-heroicons-shopping-bag"
                  class="w-4 h-4 mr-2"
                />
                Browse Products
              </NuxtLink>

              <NuxtLink
                v-if="cartStore.itemCount > 0"
                to="/checkout"
                class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <Icon
                  name="i-heroicons-credit-card"
                  class="w-4 h-4 mr-2"
                />
                Checkout ({{ cartStore.itemCount }} items)
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showTopUpModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="closeTopUpModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Add Custom Amount
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              @click="closeTopUpModal"
            >
              <Icon
                name="i-heroicons-x-mark"
                class="w-5 h-5"
              />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Amount ($)
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span
                    class="text-gray-500 dark:text-gray-400 sm:text-sm"
                  >
                    $
                  </span>
                </div>
                <input
                  v-model.number="customAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  class="block w-full pl-7 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                @click="closeTopUpModal"
              >
                Cancel
              </button>
              <button
                class="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="
                  !customAmount ||
                  customAmount <= 0 ||
                  walletStore.loading
                "
                @click="handleCustomTopUp"
              >
                <span v-if="walletStore.loading">Processing...</span>
                <span v-else>Add ${{ customAmount || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { toast } from 'vue3-toastify';

  useSeoMeta({
    title: 'My Wallet - TokoTok',
    description:
      'Manage your wallet balance and view your purchase history.'
  });

  const cartStore = useCartStore();
  const walletStore = useWalletStore();

  onMounted(() => {
    if (process.client) {
      walletStore.loadFromStorage();
    }
  });

  const showTopUpModal = ref(false);
  const customAmount = ref(0);

  const quickAmounts = [10, 25, 50, 100];

  const recentTransactions = computed(() => {
    return walletStore.transactions
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  });

  const totalSpent = computed(() => {
    return walletStore.transactions
      .filter((t) => t.type === 'purchase')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  });

  const totalAdded = computed(() => {
    return walletStore.transactions
      .filter((t) => t.type === 'topup')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const quickTopUp = async (amount) => {
    try {
      await walletStore.topUp(amount, `Quick top-up of $${amount}`);
      toast.success(`Successfully added $${amount} to your wallet!`);
    } catch (error) {
      toast.error(`Failed to top up wallet: ${error.message}`);
    }
  };

  const openCustomTopUpModal = () => {
    showTopUpModal.value = true;
    customAmount.value = 0;
  };

  const closeTopUpModal = () => {
    showTopUpModal.value = false;
    customAmount.value = 0;
  };

  const handleCustomTopUp = async () => {
    if (!customAmount.value || customAmount.value <= 0) return;

    try {
      await walletStore.topUp(
        customAmount.value,
        `Custom top-up of $${customAmount.value}`
      );
      closeTopUpModal();
      toast.success(
        `Successfully added $${customAmount.value} to your wallet!`
      );
    } catch (error) {
      toast.error(`Failed to top up wallet: ${error.message}`);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
        return 'heroicons:arrow-up';
      case 'purchase':
        return 'heroicons:shopping-cart';
      case 'refund':
        return 'heroicons:arrow-uturn-left';
      default:
        return 'heroicons:currency-dollar';
    }
  };

  const getTransactionIconClass = (type) => {
    const baseClass = 'p-2 rounded-full';
    switch (type) {
      case 'topup':
        return `${baseClass} bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400`;
      case 'purchase':
        return `${baseClass} bg-green-100 dark:bg-green-900 text-blue-600 dark:text-blue-400`;
      case 'refund':
        return `${baseClass} bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400`;
      default:
        return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400`;
    }
  };

  const getAmountClass = (type) => {
    const baseClass = 'font-semibold';
    switch (type) {
      case 'topup':
        return `${baseClass} text-green-600 dark:text-green-400`;
      case 'purchase':
        return `${baseClass} text-red-600 dark:text-red-400`;
      case 'refund':
        return `${baseClass} text-blue-600 dark:text-blue-400`;
      default:
        return `${baseClass} text-gray-600 dark:text-gray-400`;
    }
  };
</script>
