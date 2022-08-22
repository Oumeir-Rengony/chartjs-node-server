# Chartjs-Node-Server

This is a node api to convert chart made using chartjs into an Base64 image

# Installation
Change directory to your project folder and install with NPM.

```bash
cd your/project/folder
npm i
```

# Usage

Run the following command to start server:
```bash
npm run dev
```

## Routes
- `/ping` to test if server is up and running.
- `/createChart` to return Base64 Image.
    ```bash
    use the below object as parameter to test route 
    {
        {
		enableAccessibleFeatures: false,
		resultUiString: {},
		tabTitle: "Weight",
		width: 400,
		height: 309,
		xLabel: "Months",
		yLabel: "Pounds",
		zLabel: "Percentiles*",
		unit: "lbs.",
		value: 18.2,
		age: 8,
		datapoints: {
			first: {
			label: "98th",
			data: [
				5.5,
				7.5,
				9.5,
				11,
				12,
				13,
				14,
				14.5,
				15.2,
				15.75,
				16,
				16.5,
				17,
				17.5,
				17.75,
				18,
				18.5,
				19,
				19.25,
				19.5,
				19.75,
				20.25,
				20.5,
				20.8,
				21.2
			]
			},
			second: {
			label: "50th",
			data: [
				7,
				10,
				12,
				14,
				15.45,
				16.5,
				17.5,
				18.2,
				19,
				19.5,
				20.2,
				20.75,
				21.2,
				21.6,
				22.2,
				22.5,
				23,
				23.5,
				24,
				24.5,
				25,
				25.25,
				25.75,
				26.25,
				26.75
			]
			},
			third: {
			label: "2nd",
			data: [
				9.75,
				12.75,
				15.45,
				17.5,
				19,
				20.5,
				21.55,
				22.75,
				23.5,
				24.25,
				25,
				25.5,
				26.45,
				27,
				27.5,
				28.25,
				29,
				29.5,
				30,
				30.5,
				31.25,
				31.75,
				32.5,
				33,
				33.8
			]
			}
		},
		isMobile: true,
		colors: {
			lightGray: "#f0f2f2",
			indigoTransparent: "#5c5c5c",
			teal: "#00b2a9",
			indigo: "#1e647d",
			bgTeal: "#e5f6f6",
			tealTransparent: "#00b2a943",
			lightTeal: "#bbebe2",
			lightTealTransparent: "#bbebe243",
			bgTealTransparent: "#bbebe280",
			yellow: "#ffd406",
			fontFamily: "Harmonia Sans Std Regular",
			baseColor: "#979797"
		}
	}
    ```