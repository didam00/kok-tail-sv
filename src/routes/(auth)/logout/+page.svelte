<script lang="ts">
  import { redirect } from "@sveltejs/kit";

  const params = new URLSearchParams(window.location.search);
  const fromurl: string = params.get("url") ?? "./app";
  
  document.location = fromurl;
</script>