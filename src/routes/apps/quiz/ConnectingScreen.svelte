<script lang="ts">
    import { browser } from '$app/environment';
    import { client } from './client.js';

    if (browser) {
        client.run();
    }
</script>

<h1>
    Connecting...
    <i class="ti ti-settings" />
</h1>
