from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read-only methods: GET, HEAD, OPTIONS are fine.
        if request.method in SAFE_METHODS:
            return True

        return obj.user == request.user
