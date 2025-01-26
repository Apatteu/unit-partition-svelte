<script>
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-sonner';

	import '../app.css';

	let isMenuOpen = false;

	const navbar1Pages = ['/signin', '/about', '/contact', '/signup'];
	const navbar2Pages = ['/', '/inventory', '/transactions', '/request', '/profile'];

	$: isNavbar1 = navbar1Pages.includes($page.url.pathname);
	$: isNavbar2 = navbar2Pages.includes($page.url.pathname);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function logOut() {
		localStorage.removeItem('token');
		window.location.href = '/signin';
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
		rel="stylesheet"
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
	/>
</svelte:head>

{#if isNavbar1}
	<nav class="navbar navbar-guest">
		<div class="navbar-container">
			<a href="/" class="logo">Apateu</a>
			<div class="menu-toggle" on:click={toggleMenu}>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</div>
			<div class={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
				<a href="/about" class="nav-link">About</a>
				<a href="/contact" class="nav-link">Contact</a>
			</div>
		</div>
	</nav>
	<img src="./images/background.png" alt="background" class="background" />
{/if}

{#if isNavbar2}
	<nav class="navbar navbar-user">
		<div class="navbar-container">
			<a href="/" class="logo">Apateu</a>
			<div class="menu-toggle" on:click={toggleMenu}>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</div>
			<div class={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
				<a href="/inventory" class="nav-link">Units</a>
				<a href="/transactions" class="nav-link">Transactions</a>
				<a href="/request" class="nav-link">Maintenance</a>
				<a href="/profile" class="nav-link profile-link">
					<i class="fas fa-user-circle"></i>
					<span>Profile</span>
				</a>
				<button on:click={logOut} class="logout-btn">
					<i class="fas fa-sign-out-alt"></i>
					Logout
				</button>
			</div>
		</div>
	</nav>
{/if}
<Toaster />
<main class="main-content">
	<slot></slot>
</main>

<style lang="postcss">
	:global(body) {
		font-family: 'Inter', sans-serif;
		margin: 0;
		padding: 0;
		background-color: #f4f4f4;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		color: #333;
		line-height: 1.6;
	}

	.background {
		position: absolute;
		z-index: 1;
	}

	.navbar {
		background-color: #2c3e50;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.navbar-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem 1rem;
	}

	.logo {
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.logo:hover {
		color: #3498db;
	}

	.nav-menu {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.nav-link {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.nav-link:hover {
		background-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
	}

	.profile-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.profile-link i {
		font-size: 1.2rem;
	}

	.logout-btn {
		background-color: #e74c3c;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.logout-btn:hover {
		background-color: #c0392b;
		transform: translateY(-2px);
	}

	.menu-toggle {
		display: none;
		flex-direction: column;
		cursor: pointer;
	}

	.bar {
		width: 25px;
		height: 3px;
		background-color: white;
		margin: 3px 0;
		transition: 0.4s;
	}

	.main-content {
		flex: 1;
		padding: 2rem;
		max-width: 1536px;
		margin: 0 auto;
		width: 100%;
		z-index: 2;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: flex;
		}

		.nav-menu {
			display: none;
			flex-direction: column;
			width: 100%;
			position: absolute;
			top: 100%;
			left: 0;
			background-color: #2c3e50;
			padding: 1rem;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		}

		.nav-menu.active {
			display: flex;
		}

		.nav-link,
		.logout-btn {
			width: 100%;
			text-align: center;
			margin: 0.5rem 0;
		}

		.navbar-container {
			position: relative;
		}
	}

	@media (max-width: 480px) {
		.main-content {
			padding: 1rem;
		}
	}
</style>
