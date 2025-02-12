<script lang="ts">
    let counter = $state(1);
    function increment() {
        counter++;
    }
</script>

<button onclick={increment}>
    Increment counter
</button>

<p>
    Counter: {counter}
</p>