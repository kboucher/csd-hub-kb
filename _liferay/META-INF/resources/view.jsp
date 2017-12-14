<%-- @page import="com.liferay.portal.kernel.theme.ThemeDisplay" --%>
<%@ include file="/init.jsp" %>

<%--
    This global object may not be necessary. Currently
    trying out accessing these values through the
    global Liferay.ThemeDisplay JS object.

    long groupId = themeDisplay.getSiteGroupId();
    String portalUrl = themeDisplay.getPortalURL();
    long userId = themeDisplay.getUserId();
    <script type="text/javascript">
        var LIFERAY_VARS = {
            groupId: <%= groupId %>,
            portalUrl: '<%= portalUrl %>',
            userId: <%= userId %>
        };
    </script>
--%>


<jsp:include page="index.html" />
