module.exports = {
    extends: [
        "react-app",
        "react-app/jest",
        "plugin:prettier/recommended"
        // "prettier",
    ],
	rules: {
		"no-unused-vars": "off",
    	"@typescript-eslint/no-unused-vars": ["off"],
	}
}