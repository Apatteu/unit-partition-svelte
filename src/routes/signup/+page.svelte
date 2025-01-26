<script lang="ts">
	import { toast } from 'svelte-sonner';
	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let phone = '';
	let role: 'TENANT' | 'LANDLORD' = 'LANDLORD';
	let firstName = '';
	let lastName = '';
	let passwordError = '';
	let phoneError = '';
	let generalError = '';

	async function handleSubmit() {
		passwordError = '';
		phoneError = '';
		generalError = '';

		if (password !== confirmPassword) {
			passwordError = 'Passwords do not match';
			toast.error('Password Mismatch', { description: 'Please ensure passwords match' });
			return;
		}

		if (!/^\d{11}$/.test(phone)) {
			phoneError = 'Please enter a valid Philippine phone number';
			toast.error('Invalid Phone Number', {
				description: 'Please enter a valid 11-digit phone number'
			});
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					role,
					firstName,
					lastName,
					phone
				})
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem('token', data.token);
				toast.success('Account Created', { description: 'You have successfully signed up!' });
				window.location.href = '/signin';
			} else {
				generalError = data.message || 'Registration failed';
				toast.error('Registration Failed', { description: generalError });
			}
		} catch (error) {
			generalError = 'Network error. Please try again.';
			toast.error('Network Error', { description: 'Please check your connection and try again' });
			console.error('Signup error:', error);
		}
	}

	function handlePhoneInput(event: Event) {
		const target = event.target as HTMLInputElement;
		phone = target.value.replace(/\D/g, '');
	}
</script>

<div class="signup-container">
	<div class="signup-card">
		<h2 class="signup-title">Create Your Account</h2>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<label for="firstName">First Name</label>
				<input
					id="firstName"
					class="form-input"
					type="text"
					bind:value={firstName}
					required
					placeholder="Enter your first name"
				/>
			</div>

			<div class="form-group">
				<label for="lastName">Last Name</label>
				<input
					id="lastName"
					class="form-input"
					type="text"
					bind:value={lastName}
					required
					placeholder="Enter your last name"
				/>
			</div>

			<div class="form-group">
				<label for="email">Email Address</label>
				<input
					id="email"
					class="form-input"
					type="email"
					bind:value={email}
					required
					placeholder="example@gmail.com"
				/>
			</div>

			<div class="form-group">
				<label for="phone">Phone Number</label>
				<input
					id="phone"
					class="form-input"
					type="tel"
					inputmode="numeric"
					bind:value={phone}
					on:input={handlePhoneInput}
					required
					placeholder="09171234567"
				/>
				{#if phoneError}
					<div class="error-message">{phoneError}</div>
				{/if}
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					class="form-input"
					type="password"
					bind:value={password}
					required
					placeholder="Enter your password"
				/>
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					class="form-input"
					type="password"
					bind:value={confirmPassword}
					required
					placeholder="Confirm your password"
				/>
			</div>

			{#if passwordError}
				<div class="error-message">{passwordError}</div>
			{/if}

			{#if generalError}
				<div class="error-message">{generalError}</div>
			{/if}
			<div class="links">
				<p>Already have an account? <a href="./signin">Signin</a></p>
			</div>
			<button type="submit" class="submit-btn">Create Account</button>
		</form>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
		font-family: 'Inter';
	}

	.signup-container {
		display: flex;
		min-height: 100%;
		justify-content: center;
		align-items: start;
		overflow: auto;
	}

	.signup-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		padding: 40px;
		width: 100%;
		max-width: 500px;
		height: 100%;
		transition: all 0.3s ease;
	}

	.signup-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}

	.signup-title {
		text-align: center;
		color: #333;
		margin-bottom: 30px;
		font-size: 24px;
		font-weight: 700;
	}

	.form-group {
		margin-bottom: 5px;
	}

	.form-group label {
		display: block;
		margin-bottom: 8px;
		color: #555;
		font-weight: 600;
	}

	.form-input {
		width: 100%;
		padding: 12px 15px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 16px;
		transition: all 0.3s ease;
	}

	.form-input:focus {
		border-color: #667eea;
		outline: none;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
	}

	.error-message {
		color: #ff4b4b;
		font-size: 14px;
		margin-top: 8px;
		animation: shake 0.4s linear;
	}

	.submit-btn {
		width: 100%;
		padding: 15px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 10px;
	}

	.submit-btn:hover {
		opacity: 0.9;
		transform: translateY(-3px);
	}

	.role-selector {
		display: flex;
		gap: 5px;
		margin-bottom: 20px;
	}

	.role-option {
		flex: 1;
		padding: 12px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.role-option.selected {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-color: transparent;
	}

	@media (max-width: 600px) {
		.signup-card {
			padding: 20px;
		}

		.role-selector {
			flex-direction: column;
		}
	}
</style>
