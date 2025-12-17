from rest_framework.pagination import CursorPagination

class FeedCursorPagination(CursorPagination):
    page_size = 2
    ordering = "-created_at"
