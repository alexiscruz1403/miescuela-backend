module.exports = ({ env }) => ({
    'users-permissions': {
        config: {
            jwtManagement: 'legacy-support',
            jwt: {
                expiresIn: '7d'
            }
        }
    }
});
