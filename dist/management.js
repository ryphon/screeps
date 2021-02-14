modules.exports = {
    getRole: function(roleName) {
        for (var role of Memory.roles) {
            if (role.name == roleName) {
                return role
            }
        }
    }
};