<script>
	import { page } from '$app/stores';
	import "../app.css";
  
	let isMenuOpen = false;
  
	const navbar1Pages = ["/", "/about", "/contact",];
	const navbar2Pages = ["/dashboard", "/inventory", "/transactions", "/request"];
  
	$: isNavbar1 = navbar1Pages.includes($page.url.pathname);
	$: isNavbar2 = navbar2Pages.includes($page.url.pathname);
  
	function toggleMenu() {
	  isMenuOpen = !isMenuOpen;
	}
  
	function logOut() {
	  window.location.href = '/';
	}
  </script>
  
  <svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </svelte:head>
  
  {#if isNavbar1}
	<div class="navbar">
	  <a href="/" class="mr-auto font-bold logo">Apateu</a>
	  <button class="burger" on:click={toggleMenu} aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
	  </button>
	  <div class={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
		<a href="/about">About</a>
		<a href="/contact">Contact</a>
	  </div>
	</div>
  {/if}
  
  {#if isNavbar2}
	<div class="navbar">
	  <a href="/" class="mr-auto font-bold logo">Apateu</a>
	  <button class="burger" on:click={toggleMenu} aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
	  </button>
	  <div class={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
		<a href="/inventory">Units</a>
		<a href="/transactions">Transactions</a>
		<a href="/request">Maintenance</a>
		<a href="/dashboard" class="profile-link">
		  <img src="/image/avatar.jpg" alt="Avatar" class="avatar-icon" />
		  <span>Profile</span>
		</a>
		
		<button on:click={logOut} class="logout-button">
		  <i class="fas fa-sign-out-alt"></i> Logout
		</button>
	  </div>
	</div>
  {/if}
  
  <main class="main-content">
	<slot></slot>
  </main>
  
  <style>
	:global(body) {
	  font-family: 'Poppins', sans-serif;
	  margin: 0;
	  padding: 0;
	  background-color: #dbdbdb;
	  display: flex;
	  flex-direction: column;
	  min-height: 100vh;
	  overflow-x: hidden;  /* Prevent horizontal scrolling */
	}
  
	.navbar {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  flex-wrap: wrap;
	  background-color: #515739;
	  padding: 0.5rem 1.5rem;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	  width: 100%;
	  position: relative;
	  z-index: 10;
	}
  
	.navbar a {
	  color: #ffffff;
	  text-decoration: none;
	  padding: 0.75rem 1.5rem;
	  font-size: 1rem;
	  border-radius: 0.5rem;
	  display: inline-block;
	  transition: transform 0.2s, background-color 0.2s, box-shadow 0.3s;
	}
  
	.navbar a:hover {
	  background-color: #7a8357;
	  color: #ffffff;
	  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
	  transform: translateY(-3px);
	}
  
	.navbar .logo {
	  font-size: 1.5rem;
	  font-weight: bold;
	  transition: transform 0.2s, color 0.2s;
	}
  
	.navbar-links {
	  display: flex;
	  align-items: center;
	  gap: 1rem;
	  position: relative; /* Ensure navbar is not affected by profile hover */
	}
  
	.profile-link {
	  display: flex;
	  align-items: center;
	  gap: 0.5rem;
	}
  
	.avatar-icon {
	  width: 24px;
	  height: 24px;
	  border-radius: 50%;
	  vertical-align: middle;
	}
  
	.logout-button {
	  background: none;
	  border: none;
	  color: #ffffff;
	  font-size: 1rem;
	  cursor: pointer;
	  padding: 0.75rem 1.5rem;
	  transition: transform 0.2s, background-color 0.2s, box-shadow 0.3s;
	}
  
	.logout-button:hover {
	  background-color: #7a8357;
	  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
	  transform: translateY(-3px);
	  border-radius: 10px;
	}
  
	.burger {
	  display: none;
	  flex-direction: column;
	  cursor: pointer;
	  background: none;
	  border: none;
	  position: absolute;
	  top: 0.5rem;
	  right: 1.5rem;
	}
  
	.line {
	  width: 20px;
	  height: 2px;
	  background-color: #ffffff;
	  margin: 3px 0;
	  transition: 0.3s;
	}
  
	.main-content {
	  flex: 1;
	  padding: 2rem;
	  display: flex;
	  flex-direction: column;
	  justify-content: flex-start;  /* Adjust alignment */
	  min-height: 0;  /* Prevents flex container from shrinking */
	}
  
	@media (max-width: 768px) {
	  .navbar {
		flex-direction: column;
		align-items: flex-start;
	  }
  
	  .burger {
		display: flex;
		top: 1rem;
		right: 1.5rem;
	  }
  
	  .navbar-links {
		display: none;
		flex-direction: column;
		width: 100%;
	  }
  
	  .navbar-links.open {
		display: flex;
	  }
  
	  .navbar a {
		width: 100%;
		text-align: left;
		padding: 1rem;
	  }
	}
  
	@media (max-width: 480px) {
	  .navbar .logo {
		font-size: 1.1rem;
	  }
  
	  .main-content {
		padding: 1rem;
	  }
	}
  </style>
  